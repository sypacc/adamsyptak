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

/* ------------------------------------------------------------------ */
/* Rozvrh dne                                                          */
/* ------------------------------------------------------------------ */
// Jediný zdroj pravdy o tom, co je v daný den obsazené. Všechno ostatní
// (kalendář, časová osa, kontrola před platbou) se ptá přes rangeConflict(),
// takže nikde nejde vybrat ani zaplatit hodinu, která už je zabraná.

export const DAY_HOURS = DAY_END - DAY_START;

// Malý deterministický generátor (mulberry32): stejný den = stejná
// obsazenost při každém načtení, ale dny se mezi sebou výrazně liší.
function seededRandom(key) {
  var a = hashStr(key) || 1;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    var t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fiktivní rezervace ostatních zákazníků. Sobota bývá plná, úterý a
// čtvrtek klidnější a zhruba každý šestý den je úplně volný — kalendář
// tak vypadá jako u skutečného provozu.
function demoBookingsForDate(key) {
  var rand = seededRandom(key);
  var weekday = new Date(key + "T00:00:00").getDay();
  if (rand() < 0.16) return [];
  var load = weekday === 6 ? 0.55 + rand() * 0.4 : 0.2 + rand() * 0.45;
  var target = Math.round(load * DAY_HOURS);
  var lengths = [1, 2, 2, 2, 3, 3, 4];
  var bookings = [];
  var taken = [];
  for (var attempt = 0; attempt < 40 && taken.length < target; attempt++) {
    var hours = lengths[Math.floor(rand() * lengths.length)];
    var start = DAY_START + Math.floor(rand() * (DAY_HOURS - hours + 1));
    var clash = false;
    for (var h = start; h < start + hours; h++) {
      if (taken.indexOf(h) !== -1) { clash = true; break; }
    }
    if (clash) continue;
    for (var k = start; k < start + hours; k++) taken.push(k);
    bookings.push({ start: start, hours: hours, name: FICTIONAL_NAMES[Math.floor(rand() * FICTIONAL_NAMES.length)], isOwn: false });
  }
  bookings.sort(function (x, y) { return x.start - y.start; });
  return bookings;
}

// Zaplacené rezervace z tohoto prohlížeče. Ukládají se do localStorage a
// zároveň do paměti — když úložiště nejde použít (anonymní okno, zakázané
// cookies), hodiny zůstanou zablokované aspoň do zavření stránky.
var STORAGE_KEY = "trackwise-bookings";
var memoryBookings = {};

function readUserBookings() {
  var stored = {};
  try {
    var raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    if (raw && typeof raw === "object") stored = raw;
  } catch (e) {
    stored = {};
  }
  var merged = {};
  [stored, memoryBookings].forEach(function (src) {
    Object.keys(src).forEach(function (key) {
      if (!Array.isArray(src[key])) return;
      merged[key] = (merged[key] || []).concat(src[key]);
    });
  });
  return merged;
}

function userBookingsForDate(key) {
  var seen = {};
  return (readUserBookings()[key] || [])
    .filter(function (b) {
      if (!b || !Number.isInteger(b.start) || !Number.isInteger(b.hours)) return false;
      var id = b.start + ":" + b.hours;
      if (seen[id]) return false; // stejná rezervace z paměti i z úložiště
      seen[id] = true;
      return true;
    })
    .map(function (b) { return { start: b.start, hours: b.hours, name: "Tvoje rezervace", isOwn: true }; });
}

export function bookingsForDate(key) {
  return demoBookingsForDate(key)
    .concat(userBookingsForDate(key))
    .sort(function (x, y) { return x.start - y.start; });
}

// Do které hodiny (bez ní) už dnes nejde začít — běžící hodina se počítá
// jako proběhlá.
export function pastUntil(key, now) {
  now = now || new Date();
  if (key !== dateKey(now)) return DAY_START;
  return Math.min(DAY_END, Math.max(DAY_START, now.getHours() + 1));
}

// Stav každé hodiny dne: "free" | "booked" | "own" | "past".
export function hourStates(key) {
  var states = [];
  var until = pastUntil(key);
  for (var h = DAY_START; h < DAY_END; h++) states.push(h < until ? "past" : "free");
  bookingsForDate(key).forEach(function (b) {
    for (var i = b.start; i < b.start + b.hours; i++) {
      if (i >= DAY_START && i < DAY_END) states[i - DAY_START] = b.isOwn ? "own" : "booked";
    }
  });
  return states;
}

// Kontrola, jestli se trénink od `start` na `hours` hodin vejde. Vrací null,
// když je vše volné, jinak důvod a první hodinu, kde to drhne.
export function rangeConflict(key, start, hours) {
  if (!Number.isInteger(start) || !Number.isInteger(hours) || hours < 1) {
    return { reason: "Neplatný výběr", hour: start };
  }
  if (start < DAY_START) return { reason: "Otevíráme v " + pad(DAY_START) + ":00", hour: start };
  if (start + hours > DAY_END) return { reason: "Končíme v " + pad(DAY_END) + ":00", hour: DAY_END };
  var states = hourStates(key);
  for (var h = start; h < start + hours; h++) {
    var st = states[h - DAY_START];
    if (st === "past") return { reason: "Tahle hodina už dnes proběhla", hour: h };
    if (st === "booked" || st === "own") {
      return { reason: "V " + pad(h) + ":00 je obsazeno", hour: h };
    }
  }
  return null;
}

export function validStartHours(key, hours) {
  var starts = [];
  for (var h = DAY_START; h + hours <= DAY_END; h++) {
    if (!rangeConflict(key, h, hours)) starts.push(h);
  }
  return starts;
}

export function isOpenDay(d) {
  var key = dateKey(d);
  if (EVENTS[key]) return false;
  return OPEN_WEEKDAYS.indexOf(d.getDay()) !== -1;
}

// Uloží zaplacenou rezervaci. Před uložením se ještě jednou ověří, že je
// termín volný — vrací false, pokud mezitím došlo ke kolizi.
export function saveUserBooking(key, start, hours) {
  if (rangeConflict(key, start, hours)) return false;
  var entry = { start: start, hours: hours };
  memoryBookings[key] = (memoryBookings[key] || []).concat([entry]);
  try {
    var raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    var all = raw && typeof raw === "object" ? raw : {};
    all[key] = (Array.isArray(all[key]) ? all[key] : []).concat([entry]);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    /* úložiště nedostupné — rezervace drží v paměti */
  }
  return true;
}
