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
    maxStep: 1,
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
    accountPrompt: document.querySelector('.account-prompt'),
    form: document.getElementById('bookingForm'),
    levelSelect: document.getElementById('levelSelect'),
    sideRows: document.getElementById('sideRows'),
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
        // Dostupné dny/hodiny se liší podle délky — dřívější výběr
        // termínu i rozpracovaná rezervace v košíku už neplatí.
        state.selectedDate = null;
        state.startHour = null;
        els.slotPanel.hidden = true;
        if (window.TWCart) window.TWCart.clearReservation();
        renderDurations();
        renderCalendar();
        updateNextEnabled(1);
        renderSideSummary();
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

  // Když je uživatel přihlášený (demo účet), prompt v kroku 2 to
  // ukáže místo nabídky přihlášení a předvyplní jméno/e-mail.
  function renderAccountPrompt() {
    if (!els.accountPrompt) return;
    var user = window.TWAuth && window.TWAuth.getUser();
    if (user) {
      els.accountPrompt.textContent = 'Přihlášen(a) jako ' + user.name + ' — údaje se vyplní automaticky.';
      var firstNameInput = els.form.querySelector('[name="firstName"]');
      var emailInput = els.form.querySelector('[name="email"]');
      if (firstNameInput && !firstNameInput.value) firstNameInput.value = user.name;
      if (emailInput && !emailInput.value) emailInput.value = user.email;
      updateNextEnabled(2);
    } else {
      els.accountPrompt.innerHTML =
        'Máš u nás účet? <button type="button" class="link-btn" data-auth-open="login">Přihlásit se</button>' +
        ' — příště se ti údaje vyplní automaticky. Nemáš? <button type="button" class="link-btn" data-auth-open="register">Založit profil</button>.';
    }
  }

  window.addEventListener('tw-auth-changed', renderAccountPrompt);

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

    var daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    var shown = 0;

    for (var day = 1; day <= daysInMonth; day++) {
      var d = new Date(cursor.getFullYear(), cursor.getMonth(), day);
      var key = dateKey(d);

      var isPast = d.getTime() < today.getTime();
      var eventName = EVENTS[key];
      var starts = (!eventName && !isPast && isOpenDay(d))
        ? validStartHours(key, state.duration ? state.duration.hours : 1)
        : [];

      // Zavřené, proběhlé nebo zcela plné dny (kromě akcí) se v kalendáři
      // vůbec nezobrazují — jen volné dny a dny s akcí okruhu.
      if (!eventName && (isPast || !isOpenDay(d) || starts.length === 0)) continue;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day';
      btn.innerHTML =
        '<span class="cal-day-weekday">' + WEEKDAY_LABELS[(d.getDay() + 6) % 7] + '</span>' +
        '<span class="cal-day-num">' + day + '</span>';
      shown++;

      if (eventName) {
        btn.classList.add('is-event');
        btn.disabled = true;
        btn.title = 'Obsazeno akcí: ' + eventName;
      } else {
        var dot = document.createElement('span');
        dot.className = 'cal-dot';
        var booked = bookedHoursForDate(key);
        if (booked.length > 0) btn.classList.add('is-busy');
        btn.appendChild(dot);
        if (state.selectedDate === key) btn.classList.add('is-selected');
        btn.addEventListener('click', function (clickedKey, clickedDate) {
          return function () {
            // Druhý klik na už vybraný den ho odznačí.
            if (state.selectedDate === clickedKey) {
              state.selectedDate = null;
              state.startHour = null;
              els.slotPanel.hidden = true;
            } else {
              state.selectedDate = clickedKey;
              state.startHour = null;
              renderSlots(clickedDate);
            }
            renderCalendar();
            updateNextEnabled(3);
            renderSideSummary();
          };
        }(key, d));
      }

      els.calGrid.appendChild(btn);
    }

    if (shown === 0) {
      var none = document.createElement('p');
      none.className = 'calendar-empty-note';
      none.textContent = 'V tomto měsíci už nejsou žádné volné termíny.';
      els.calGrid.appendChild(none);
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
            renderSideSummary();
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

    if (window.TWCart && d && state.selectedDate && state.startHour !== null) {
      window.TWCart.setReservation({
        durationLabel: 'Trénink — ' + d.label,
        price: d.price,
        dateLabel: dateLabel,
        timeLabel: timeLabel
      });
    }

    function row(label, value) {
      return '<dl class="summary-row"><dt>' + label + '</dt><dd>' + value + '</dd></dl>';
    }
  }

  function renderSideSummary() {
    if (!els.sideRows) return;
    var d = state.duration;
    var rows = [];
    rows.push(sideRow('Délka', d ? d.label : '—'));
    if (state.selectedDate) {
      var dateObj = new Date(state.selectedDate + 'T00:00:00');
      var label = pad(dateObj.getDate()) + '. ' + (dateObj.getMonth() + 1) + '. ' + dateObj.getFullYear();
      if (state.startHour !== null && d) label += ' · ' + pad(state.startHour) + ':00–' + pad(state.startHour + d.hours) + ':00';
      rows.push(sideRow('Termín', label));
    }
    if (state.personal && state.personal.firstName) {
      rows.push(sideRow('Jméno', (state.personal.firstName + ' ' + state.personal.lastName).trim()));
    }
    rows.push('<dl class="side-row side-total"><dt>Celkem</dt><dd>' + (d ? d.price.toLocaleString('cs-CZ') + ' Kč' : '—') + '</dd></dl>');
    els.sideRows.innerHTML = rows.join('');

    function sideRow(label, value) {
      return '<dl class="side-row"><dt>' + label + '</dt><dd>' + value + '</dd></dl>';
    }
  }

  els.payButton.addEventListener('click', function () {
    // TODO: napojit skutečnou platební bránu; zatím jen demo potvrzení.
    els.payButton.disabled = true;
    els.payButton.textContent = 'Odesíláno…';
    setTimeout(function () {
      if (window.TWCart) window.TWCart.clearReservation();
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
    state.maxStep = Math.max(state.maxStep, step);
    els.steps.forEach(function (el) {
      var n = parseInt(el.getAttribute('data-step'), 10);
      el.classList.toggle('is-active', n === step);
      // "Hotovo/dostupné" i při návratu zpět — ne jen dokud jsme
      // aktuálně za daným krokem, ale dokud jsme ho už jednou dosáhli.
      el.classList.toggle('is-done', n !== step && n <= state.maxStep);
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

  // Kliknutí na číslo dokončeného/aktuálního kroku se vrátí na danou sekci.
  els.steps.forEach(function (el) {
    el.setAttribute('tabindex', '0');
    var jump = function () {
      var n = parseInt(el.getAttribute('data-step'), 10);
      if (el.classList.contains('is-done') || el.classList.contains('is-active')) {
        goToStep(n);
      }
    };
    el.addEventListener('click', jump);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        jump();
      }
    });
  });

  if (els.form) {
    els.form.addEventListener('input', function () {
      updateNextEnabled(2);
      var fd = new FormData(els.form);
      state.personal = state.personal || {};
      state.personal.firstName = fd.get('firstName');
      state.personal.lastName = fd.get('lastName');
      renderSideSummary();
    });
  }

  // -------------------------------------------------- //
  // Init                                                 //
  // -------------------------------------------------- //
  renderDurations();
  renderLevels();
  renderCalendar();
  renderAccountPrompt();
  updateNextEnabled(1);
  renderSideSummary();
})();
