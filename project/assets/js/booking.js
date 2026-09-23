(function () {
  'use strict';

  // TODO: reálné ceny, otevírací dny a názvy zájemců/akcí doplnit podle
  // skutečného provozu okruhu — teď je vše fiktivní/placeholder.
  var DURATIONS = [
    { hours: 1, label: '1 hodina', price: 3990 },
    { hours: 2, label: '2 hodiny', price: 6990 },
    { hours: 3, label: '3 hodiny', price: 9990 },
    { hours: 4, label: '4 hodiny', price: 12990 },
    { hours: 6, label: 'Půl dne (6 hodin)', price: 17990 }
  ];

  var LEVELS = [
    'Začátečník — první jízdy na okruhu',
    'Mírně pokročilý — pár track days za sebou',
    'Pokročilý — pravidelně jezdím na okruhu',
    'Držitel závodní licence'
  ];

  // Dny v týdnu, kdy okruh podle domluvy funguje pro tréninky (0 = neděle).
  var OPEN_WEEKDAYS = [2, 4, 6]; // úterý, čtvrtek, sobota
  var DAY_START = 9;
  var DAY_END = 18;

  // Reálné akce z kalendáře závodů okruhu — v ty dny trénink neběží.
  var EVENTS = {
    '2026-09-25': 'Rennevents Sprint & Endurance',
    '2026-09-26': 'Rennevents Sprint & Endurance',
    '2026-09-27': 'Rennevents Sprint & Endurance',
    '2026-10-09': 'Trackmasters (Time Attack Cup)',
    '2026-10-10': 'The Most Classic 2026',
    '2026-10-11': 'Carbonia Cup',
    '2026-10-24': 'Autoshow'
  };

  var FICTIONAL_NAMES = [
    'Jan K.', 'Petra S.', 'Tomáš H.', 'Lukáš N.',
    'Michal D.', 'Eva R.', 'Martin P.', 'Kateřina V.'
  ];

  var state = {
    step: 1,
    duration: null,
    personal: null,
    calendarCursor: startOfMonth(new Date()),
    selectedDate: null,
    startHour: null
  };

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function dateKey(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function startOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  function startOfToday() {
    var t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }

  function hashStr(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  // Deterministický (ne náhodný při každém načtení) seznam fiktivně
  // obsazených hodin pro daný den, aby kalendář působil reálně obsazeně.
  function bookedHoursForDate(key) {
    var available = [];
    for (var h = DAY_START; h < DAY_END; h++) available.push(h);
    var seed = hashStr(key);
    var count = 1 + (seed % 3); // 1–3 obsazené hodiny
    var booked = [];
    for (var i = 0; i < count && available.length; i++) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      var idx = seed % available.length;
      booked.push(available.splice(idx, 1)[0]);
    }
    booked.sort(function (a, b) { return a - b; });
    return booked;
  }

  function nameForSlot(key, hour) {
    var seed = hashStr(key + ':' + hour);
    return FICTIONAL_NAMES[seed % FICTIONAL_NAMES.length];
  }

  function isOpenDay(d) {
    var key = dateKey(d);
    if (EVENTS[key]) return false;
    return OPEN_WEEKDAYS.indexOf(d.getDay()) !== -1;
  }

  function validStartHours(key, hours) {
    var booked = bookedHoursForDate(key);
    var starts = [];
    for (var h = DAY_START; h + hours <= DAY_END; h++) {
      var ok = true;
      for (var i = 0; i < hours; i++) {
        if (booked.indexOf(h + i) !== -1) { ok = false; break; }
      }
      if (ok) starts.push(h);
    }
    return starts;
  }

  // -------------------------------------------------- //
  // DOM refs                                            //
  // -------------------------------------------------- //
  var els = {
    steps: document.querySelectorAll('.booking-step'),
    panes: document.querySelectorAll('.booking-pane'),
    durationGrid: document.getElementById('cenik'),
    form: document.getElementById('bookingForm'),
    levelSelect: document.getElementById('levelSelect'),
    calMonthLabel: document.getElementById('calMonthLabel'),
    calGrid: document.getElementById('calGrid'),
    calPrev: document.getElementById('calPrev'),
    calNext: document.getElementById('calNext'),
    slotPanel: document.getElementById('slotPanel'),
    slotDateLabel: document.getElementById('slotDateLabel'),
    slotGrid: document.getElementById('slotGrid'),
    summaryCard: document.getElementById('summaryCard'),
    payButton: document.getElementById('payButton'),
    bookingSuccess: document.getElementById('bookingSuccess')
  };

  if (!els.durationGrid) return; // booking markup not present on this page

  // -------------------------------------------------- //
  // Step 1 — duration                                   //
  // -------------------------------------------------- //
  function renderDurations() {
    els.durationGrid.innerHTML = '';
    DURATIONS.forEach(function (d) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'duration-card';
      if (state.duration && state.duration.hours === d.hours) btn.classList.add('is-selected');
      btn.innerHTML =
        '<span class="duration-hours">' + d.hours + ' h</span>' +
        '<span class="duration-label">' + d.label + '</span>' +
        '<span class="duration-price">' + d.price.toLocaleString('cs-CZ') + ' Kč</span>';
      btn.addEventListener('click', function () {
        state.duration = d;
        state.selectedDate = null;
        state.startHour = null;
        renderDurations();
        updateNextEnabled(1);
      });
      els.durationGrid.appendChild(btn);
    });
  }

  // -------------------------------------------------- //
  // Step 2 — personal info                               //
  // -------------------------------------------------- //
  function renderLevels() {
    if (!els.levelSelect) return;
    LEVELS.forEach(function (l) {
      var opt = document.createElement('option');
      opt.value = l;
      opt.textContent = l;
      els.levelSelect.appendChild(opt);
    });
  }

  function isFormValid() {
    if (!els.form) return false;
    return els.form.checkValidity();
  }

  // -------------------------------------------------- //
  // Step 3 — calendar                                    //
  // -------------------------------------------------- //
  var MONTH_NAMES = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
    'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
  var WEEKDAY_LABELS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

  function renderCalendar() {
    var cursor = state.calendarCursor;
    els.calMonthLabel.textContent = MONTH_NAMES[cursor.getMonth()] + ' ' + cursor.getFullYear();

    var today = startOfToday();
    var thisMonthStart = startOfMonth(today);
    els.calPrev.disabled = cursor.getTime() <= thisMonthStart.getTime();

    els.calGrid.innerHTML = '';

    var firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    var firstWeekday = (firstOfMonth.getDay() + 6) % 7; // pondělí = 0
    var daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();

    for (var i = 0; i < firstWeekday; i++) {
      var empty = document.createElement('div');
      empty.className = 'cal-day is-empty';
      els.calGrid.appendChild(empty);
    }

    for (var day = 1; day <= daysInMonth; day++) {
      var d = new Date(cursor.getFullYear(), cursor.getMonth(), day);
      var key = dateKey(d);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day';
      btn.textContent = day;

      var isPast = d.getTime() < today.getTime();
      var eventName = EVENTS[key];

      if (eventName) {
        btn.classList.add('is-event');
        btn.disabled = true;
        btn.title = 'Obsazeno akcí: ' + eventName;
      } else if (isPast || !isOpenDay(d)) {
        btn.disabled = true;
        if (isPast) btn.title = 'Termín už proběhl';
        else btn.title = 'Mimo provozní dny okruhu';
      } else {
        var starts = state.duration ? validStartHours(key, state.duration.hours) : validStartHours(key, 1);
        if (starts.length === 0) {
          btn.disabled = true;
          btn.classList.add('is-full-day');
          btn.title = 'Na zvolenou délku už není volný termín';
        } else {
          var dot = document.createElement('span');
          dot.className = 'cal-dot';
          var booked = bookedHoursForDate(key);
          if (booked.length > 0) btn.classList.add('is-busy');
          btn.appendChild(dot);
        }
        if (state.selectedDate === key) btn.classList.add('is-selected');
        btn.addEventListener('click', function (clickedKey, clickedDate) {
          return function () {
            state.selectedDate = clickedKey;
            state.startHour = null;
            renderCalendar();
            renderSlots(clickedDate);
            updateNextEnabled(3);
          };
        }(key, d));
      }

      els.calGrid.appendChild(btn);
    }
  }

  function renderSlots(date) {
    if (!state.duration) {
      els.slotPanel.hidden = true;
      return;
    }
    var key = dateKey(date);
    els.slotPanel.hidden = false;
    els.slotDateLabel.textContent = 'Volné časy — ' + pad(date.getDate()) + '. ' + (date.getMonth() + 1) + '. ' + date.getFullYear();
    els.slotGrid.innerHTML = '';

    var booked = bookedHoursForDate(key);
    var validStarts = validStartHours(key, state.duration.hours);

    for (var h = DAY_START; h < DAY_END; h++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot-btn';
      var isTaken = booked.indexOf(h) !== -1;
      var canStart = validStarts.indexOf(h) !== -1;

      btn.innerHTML = pad(h) + ':00–' + pad(h + 1) + ':00' +
        (isTaken ? '<span class="slot-taken-note">Obsazeno (' + nameForSlot(key, h) + ')</span>' : '');

      if (!canStart) {
        btn.disabled = true;
      } else {
        if (state.startHour === h) btn.classList.add('is-selected');
        btn.addEventListener('click', function (hour) {
          return function () {
            state.startHour = hour;
            renderSlots(date);
            updateNextEnabled(3);
          };
        }(h));
      }

      els.slotGrid.appendChild(btn);
    }
  }

  els.calPrev.addEventListener('click', function () {
    state.calendarCursor = new Date(state.calendarCursor.getFullYear(), state.calendarCursor.getMonth() - 1, 1);
    renderCalendar();
  });

  els.calNext.addEventListener('click', function () {
    state.calendarCursor = new Date(state.calendarCursor.getFullYear(), state.calendarCursor.getMonth() + 1, 1);
    renderCalendar();
  });

  // -------------------------------------------------- //
  // Step 4 — summary                                    //
  // -------------------------------------------------- //
  function renderSummary() {
    var d = state.duration;
    var p = state.personal || {};
    var dateObj = state.selectedDate ? new Date(state.selectedDate + 'T00:00:00') : null;
    var dateLabel = dateObj ? pad(dateObj.getDate()) + '. ' + (dateObj.getMonth() + 1) + '. ' + dateObj.getFullYear() : '—';
    var timeLabel = state.startHour !== null ? pad(state.startHour) + ':00–' + pad(state.startHour + d.hours) + ':00' : '—';

    els.summaryCard.innerHTML =
      row('Délka tréninku', d ? d.label : '—') +
      row('Termín', dateLabel + (state.startHour !== null ? ' · ' + timeLabel : '')) +
      row('Jméno', ((p.firstName || '') + ' ' + (p.lastName || '')).trim() || '—') +
      row('Kontakt', (p.phone || '—') + ' · ' + (p.email || '—')) +
      row('Řidičský level', p.level || '—') +
      '<dl class="summary-row summary-total"><dt>Celkem</dt><dd>' + (d ? d.price.toLocaleString('cs-CZ') + ' Kč' : '—') + '</dd></dl>';

    function row(label, value) {
      return '<dl class="summary-row"><dt>' + label + '</dt><dd>' + value + '</dd></dl>';
    }
  }

  els.payButton.addEventListener('click', function () {
    // TODO: napojit skutečnou platební bránu; zatím jen demo potvrzení.
    els.payButton.disabled = true;
    els.payButton.textContent = 'Odesíláno…';
    setTimeout(function () {
      els.bookingSuccess.hidden = false;
      els.payButton.closest('.booking-actions').hidden = true;
      els.bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
  });

  // -------------------------------------------------- //
  // Step navigation                                     //
  // -------------------------------------------------- //
  function goToStep(step) {
    state.step = step;
    els.steps.forEach(function (el) {
      var n = parseInt(el.getAttribute('data-step'), 10);
      el.classList.toggle('is-active', n === step);
      el.classList.toggle('is-done', n < step);
    });
    els.panes.forEach(function (el) {
      var n = parseInt(el.getAttribute('data-pane'), 10);
      el.classList.toggle('is-active', n === step);
    });
    if (step === 4) renderSummary();
    document.getElementById('rezervace').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateNextEnabled(step) {
    var pane = document.querySelector('.booking-pane[data-pane="' + step + '"]');
    var nextBtn = pane.querySelector('[data-next]');
    if (!nextBtn) return;
    if (step === 1) nextBtn.disabled = !state.duration;
    if (step === 2) nextBtn.disabled = !isFormValid();
    if (step === 3) nextBtn.disabled = !(state.selectedDate && state.startHour !== null);
  }

  document.querySelectorAll('[data-next]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (state.step === 2) {
        var fd = new FormData(els.form);
        state.personal = {
          firstName: fd.get('firstName'),
          lastName: fd.get('lastName'),
          phone: fd.get('phone'),
          email: fd.get('email'),
          level: fd.get('level')
        };
      }
      goToStep(state.step + 1);
    });
  });

  document.querySelectorAll('[data-back]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      goToStep(state.step - 1);
    });
  });

  if (els.form) {
    els.form.addEventListener('input', function () { updateNextEnabled(2); });
  }

  // -------------------------------------------------- //
  // Init                                                 //
  // -------------------------------------------------- //
  renderDurations();
  renderLevels();
  renderCalendar();
  updateNextEnabled(1);
})();
