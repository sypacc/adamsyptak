// TODO: reálné ceny, otevírací dny a názvy zájemců/akcí doplnit podle
// skutečného provozu okruhu — teď je vše fiktivní/placeholder.
export const DURATIONS = [
  { hours: 1, label: "1 hodina", price: 3990 },
  { hours: 2, label: "2 hodiny", price: 6990 },
  { hours: 3, label: "3 hodiny", price: 9990 },
  { hours: 4, label: "4 hodiny", price: 12990 },
  { hours: 6, label: "Půl dne (6 hodin)", price: 17990 },
];

export const LEVELS = [
  "Začátečník — první jízdy na okruhu",
  "Mírně pokročilý — pár track days za sebou",
  "Pokročilý — pravidelně jezdím na okruhu",
  "Držitel závodní licence",
];

// Dny v týdnu, kdy okruh podle domluvy funguje pro tréninky (0 = neděle).
export const OPEN_WEEKDAYS = [2, 4, 6]; // úterý, čtvrtek, sobota
export const DAY_START = 9;
export const DAY_END = 18;

// Reálné akce z kalendáře závodů okruhu — v ty dny trénink neběží.
export const EVENTS = {
  "2026-09-25": "Rennevents Sprint & Endurance",
  "2026-09-26": "Rennevents Sprint & Endurance",
  "2026-09-27": "Rennevents Sprint & Endurance",
  "2026-10-09": "Trackmasters (Time Attack Cup)",
  "2026-10-10": "The Most Classic 2026",
  "2026-10-11": "Carbonia Cup",
  "2026-10-24": "Autoshow",
};

export const FICTIONAL_NAMES = [
  "Jan K.", "Petra S.", "Tomáš H.", "Lukáš N.",
  "Michal D.", "Eva R.", "Martin P.", "Kateřina V.",
];

export const MONTH_NAMES = [
  "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
  "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec",
];

export const WEEKDAY_LABELS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

export function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}

export function dateKey(d) {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

export function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function startOfToday() {
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

// Deterministický (ne náhodný při každém načtení) seznam fiktivních
// rezervací pro daný den: 0–3 souvislé bloky po 1–4 hodinách, jako by si
// je zarezervovali jiní zákazníci. Díky blokům se delší trénink opravdu
// nevejde do každého dne.
function demoBookingsForDate(key) {
  var seed = hashStr(key);
  function next() {
    seed = (seed * 1103515245 + 12345) >>> 0;
    return seed >>> 16; // spodní bity LCG se opakují v krátkém cyklu
  }
  var bookings = [];
  var taken = [];
  var count = next() % 4; // 0–3 cizí rezervace
  for (var i = 0; i < count; i++) {
    var hours = 1 + (next() % 4);
    var start = DAY_START + (next() % (DAY_END - DAY_START - hours + 1));
    var clash = false;
    for (var h = start; h < start + hours; h++) {
      if (taken.indexOf(h) !== -1) { clash = true; break; }
    }
    if (clash) continue;
    for (var k = start; k < start + hours; k++) taken.push(k);
    bookings.push({ start: start, hours: hours, name: FICTIONAL_NAMES[next() % FICTIONAL_NAMES.length] });
  }
  return bookings;
}

// Rezervace dokončené v tomhle prohlížeči — po zaplacení se uloží, aby
// stejné hodiny nešlo zarezervovat znovu. Úložiště může být nedostupné
// (anonymní okno), pak se prostě nic nepamatuje.
var STORAGE_KEY = "trackwise-bookings";

function readUserBookings() {
  try {
    var raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch (e) {
    return {};
  }
}

export function saveUserBooking(key, start, hours) {
  var all = readUserBookings();
  var list = Array.isArray(all[key]) ? all[key] : [];
  list.push({ start: start, hours: hours });
  all[key] = list;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    /* úložiště nedostupné — rezervace platí jen do obnovení stránky */
  }
}

function userBookingsForDate(key) {
  var list = readUserBookings()[key];
  if (!Array.isArray(list)) return [];
  return list
    .filter(function (b) { return b && Number.isInteger(b.start) && Number.isInteger(b.hours); })
    .map(function (b) { return { start: b.start, hours: b.hours, name: "tvoje rezervace", isOwn: true }; });
}

export function bookingsForDate(key) {
  return demoBookingsForDate(key).concat(userBookingsForDate(key));
}

// Dnes už nejde začít v hodině, která proběhla (ani v té, která právě běží).
function pastHoursForDate(key, now) {
  now = now || new Date();
  if (key !== dateKey(now)) return [];
  var past = [];
  for (var h = DAY_START; h < DAY_END && h <= now.getHours(); h++) past.push(h);
  return past;
}

export function bookedHoursForDate(key) {
  var hours = [];
  bookingsForDate(key).forEach(function (b) {
    for (var h = b.start; h < b.start + b.hours; h++) {
      if (hours.indexOf(h) === -1) hours.push(h);
    }
  });
  hours.sort(function (a, b) { return a - b; });
  return hours;
}

// Hodiny, ve kterých nejde jezdit: cizí i vlastní rezervace + dnešní minulé hodiny.
export function blockedHoursForDate(key) {
  var blocked = bookedHoursForDate(key);
  pastHoursForDate(key).forEach(function (h) {
    if (blocked.indexOf(h) === -1) blocked.push(h);
  });
  blocked.sort(function (a, b) { return a - b; });
  return blocked;
}

export function bookingAt(key, hour) {
  var list = bookingsForDate(key);
  for (var i = 0; i < list.length; i++) {
    if (hour >= list[i].start && hour < list[i].start + list[i].hours) return list[i];
  }
  return null;
}

export function nameForSlot(key, hour) {
  var b = bookingAt(key, hour);
  return b ? b.name : null;
}

export function isOpenDay(d) {
  var key = dateKey(d);
  if (EVENTS[key]) return false;
  return OPEN_WEEKDAYS.indexOf(d.getDay()) !== -1;
}

// Začátky, od kterých se celý trénink dané délky vejde do otevírací doby
// a nepřekryje žádnou obsazenou ani minulou hodinu.
export function validStartHours(key, hours) {
  var blocked = blockedHoursForDate(key);
  var starts = [];
  for (var h = DAY_START; h + hours <= DAY_END; h++) {
    var ok = true;
    for (var i = 0; i < hours; i++) {
      if (blocked.indexOf(h + i) !== -1) { ok = false; break; }
    }
    if (ok) starts.push(h);
  }
  return starts;
}

// Proč z dané (volné) hodiny nejde začít — pro nápovědu u slotu.
export function startBlockReason(key, hour, hours) {
  if (hour + hours > DAY_END) return "končíme v " + pad(DAY_END) + ":00";
  var blocked = blockedHoursForDate(key);
  for (var i = 1; i < hours; i++) {
    if (blocked.indexOf(hour + i) !== -1) return "v " + pad(hour + i) + ":00 je obsazeno";
  }
  return null;
}
