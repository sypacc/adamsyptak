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

// Deterministický (ne náhodný při každém načtení) seznam fiktivně
// obsazených hodin pro daný den, aby kalendář působil reálně obsazeně.
export function bookedHoursForDate(key) {
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

export function nameForSlot(key, hour) {
  var seed = hashStr(key + ":" + hour);
  return FICTIONAL_NAMES[seed % FICTIONAL_NAMES.length];
}

export function isOpenDay(d) {
  var key = dateKey(d);
  if (EVENTS[key]) return false;
  return OPEN_WEEKDAYS.indexOf(d.getDay()) !== -1;
}

export function validStartHours(key, hours) {
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
