import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import PaymentModal from "./PaymentModal.jsx";
import TimePicker from "./TimePicker.jsx";
import {
  DURATIONS,
  LEVELS,
  EVENTS,
  MONTH_NAMES,
  WEEKDAY_LABELS,
  DAY_START,
  DAY_END,
  pad,
  dateKey,
  startOfMonth,
  startOfToday,
  isOpenDay,
  validStartHours,
  hourStates,
  rangeConflict,
  saveUserBooking,
} from "../utils/booking.js";

const STEPS = [
  { n: 1, label: "Délka" },
  { n: 2, label: "Údaje" },
  { n: 3, label: "Termín" },
  { n: 4, label: "Shrnutí" },
];

function fmtPrice(n) {
  return n.toLocaleString("cs-CZ") + " Kč";
}

// Dny v měsíci, které má smysl ukázat: otevřené dny a dny s akcí. Den, kam
// se zvolená délka tréninku nevejde, zůstává vidět, ale nejde vybrat.
function getCalendarDays(cursor, duration, selectedDate) {
  const today = startOfToday();
  const hours = duration ? duration.hours : 1;
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const days = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    const key = dateKey(d);
    const isPast = d.getTime() < today.getTime();
    const eventName = EVENTS[key];
    if (isPast || (!eventName && !isOpenDay(d))) continue;
    const states = eventName ? [] : hourStates(key);
    const starts = eventName ? [] : validStartHours(key, hours);
    const freeHours = states.filter((st) => st === "free").length;
    days.push({
      day,
      key,
      date: d,
      weekday: WEEKDAY_LABELS[(d.getDay() + 6) % 7],
      isEvent: !!eventName,
      eventName: eventName || null,
      isFull: !eventName && starts.length === 0,
      states,
      freeHours,
      isSelected: selectedDate === key,
    });
  }
  return days;
}

const FIELD_MESSAGES = {
  firstName: { missing: "Vyplň jméno." },
  lastName: { missing: "Vyplň příjmení." },
  phone: { missing: "Vyplň telefon.", invalid: "Zadej telefon, např. +420 777 123 456." },
  email: { missing: "Vyplň e-mail.", invalid: "Zadej platný e-mail, např. jan@email.cz." },
  level: { missing: "Vyber svou úroveň." },
};

function fieldError(el) {
  if (!el || el.validity.valid) return null;
  const messages = FIELD_MESSAGES[el.name] || {};
  if (el.validity.valueMissing) return messages.missing || "Vyplň toto pole.";
  return messages.invalid || messages.missing || "Zkontroluj toto pole.";
}

function formatDate(dateObj) {
  return pad(dateObj.getDate()) + ". " + (dateObj.getMonth() + 1) + ". " + dateObj.getFullYear();
}

export default function Booking() {
  const { user, openAuthModal } = useAuth();
  const { setReservation, clearReservation, paidOrder } = useCart();

  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [direction, setDirection] = useState("forward");
  const [duration, setDuration] = useState(null);
  const [personal, setPersonal] = useState(null);
  const [errors, setErrors] = useState({});
  const [calendarCursor, setCalendarCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(null);
  const [startHour, setStartHour] = useState(null);
  const [slotError, setSlotError] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formRef = useRef(null);
  const successRef = useRef(null);

  function scrollToBooking() {
    const section = document.getElementById("rezervace");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToStep(n) {
    setDirection(n < step ? "back" : "forward");
    setStep(n);
    setMaxStep((m) => Math.max(m, n));
    scrollToBooking();
  }

  // Duration changing (without a fresh date click) can leave a previously
  // picked start hour out of range for the new length — silently drop it
  // so the slot grid never shows a selection that overruns a booked hour.
  useEffect(() => {
    if (startHour === null || !selectedDate || !duration) return;
    if (rangeConflict(selectedDate, startHour, duration.hours)) {
      setStartHour(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, selectedDate]);

  // Logging in while on step 2 prefills empty name/email fields.
  useEffect(() => {
    const form = formRef.current;
    if (!user || !form) return;
    const { firstName, email } = form.elements;
    if (firstName && !firstName.value) firstName.value = user.name;
    if (email && !email.value) email.value = user.email;
    readForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Reservation flows into the shared cart as soon as step 4 has
  // everything it needs, so the cart badge/modal reflect it immediately.
  useEffect(() => {
    if (step !== 4 || !duration || !selectedDate || startHour === null || isSuccess) return;
    setReservation({
      durationLabel: "Trénink — " + duration.label,
      price: duration.price,
      dateLabel: formatDate(new Date(selectedDate + "T00:00:00")),
      timeLabel: pad(startHour) + ":00–" + pad(startHour + duration.hours) + ":00",
      // Přesný termín, aby šel trénink zaplatit i z košíku a zapsat jako obsazený.
      slot: { dateKey: selectedDate, start: startHour, hours: duration.hours },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, duration, selectedDate, startHour]);

  // Trénink zaplacený přes košík: pokud jde o právě vybraný termín,
  // formulář přejde rovnou do potvrzení.
  useEffect(() => {
    const slot = paidOrder && paidOrder.reservation && paidOrder.reservation.slot;
    if (!slot || isSuccess || !duration) return;
    if (slot.dateKey === selectedDate && slot.start === startHour && slot.hours === duration.hours) {
      setIsPaymentOpen(false);
      setIsSuccess(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paidOrder]);

  useEffect(() => {
    if (isSuccess && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      successRef.current.focus({ preventScroll: true });
    }
  }, [isSuccess]);

  function handleDurationSelect(d) {
    setDuration(d);
    setSelectedDate(null);
    setStartHour(null);
    clearReservation();
  }

  function readForm() {
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
    setPersonal({
      firstName: fd.get("firstName") || "",
      lastName: fd.get("lastName") || "",
      phone: fd.get("phone") || "",
      email: fd.get("email") || "",
      level: fd.get("level") || "",
    });
  }

  // Errors only appear once a field has been left (or on a failed submit),
  // then update live as the user corrects them.
  function handleFormInput(e) {
    readForm();
    const name = e.target.name;
    if (errors[name] !== undefined) {
      setErrors((prev) => ({ ...prev, [name]: fieldError(e.target) }));
    }
  }

  function handleFieldBlur(e) {
    const name = e.target.name;
    if (!name || !FIELD_MESSAGES[name]) return;
    setErrors((prev) => ({ ...prev, [name]: fieldError(e.target) }));
  }

  function handleNext() {
    if (step === 2) {
      const form = formRef.current;
      readForm();
      if (!form.checkValidity()) {
        const next = {};
        Array.from(form.elements).forEach((el) => {
          if (FIELD_MESSAGES[el.name]) next[el.name] = fieldError(el);
        });
        setErrors(next);
        const firstInvalid = Array.from(form.elements).find((el) => FIELD_MESSAGES[el.name] && !el.validity.valid);
        if (firstInvalid) firstInvalid.focus();
        return;
      }
    }
    if (step === 3) {
      const conflict = selectedDate && duration && startHour !== null
        ? rangeConflict(selectedDate, startHour, duration.hours)
        : { reason: "Vyber termín" };
      if (conflict) {
        setStartHour(null);
        setSlotError("Vybraný čas už není volný (" + conflict.reason.toLowerCase() + ") — vyber prosím jiný.");
        return;
      }
    }
    goToStep(step + 1);
  }

  function handleDayClick(day) {
    if (selectedDate === day.key) {
      setSelectedDate(null);
    } else {
      setSelectedDate(day.key);
    }
    setStartHour(null);
    setSlotError(null);
  }

  function handleTimeSelect(hour) {
    setSlotError(null);
    if (hour === null) {
      setStartHour(null);
      return;
    }
    if (!duration || !selectedDate || rangeConflict(selectedDate, hour, duration.hours)) return;
    setStartHour(hour);
  }

  function handlePaymentConfirm() {
    // Zaplacené hodiny se uloží jako obsazené, takže je už nikdo (ani další
    // rezervace v tomto prohlížeči) nemůže zabrat znovu. saveUserBooking
    // termín ještě jednou ověří — při kolizi se platba nedokončí.
    if (!selectedDate || !duration || startHour === null || !saveUserBooking(selectedDate, startHour, duration.hours)) {
      setIsPaymentOpen(false);
      setStartHour(null);
      clearReservation();
      setSlotError("Tenhle čas mezitím někdo zabral — vyber prosím jiný termín.");
      goToStep(3);
      return;
    }
    setIsPaymentOpen(false);
    clearReservation();
    setIsSuccess(true);
  }

  function handleNewBooking() {
    setIsSuccess(false);
    setDuration(null);
    setSelectedDate(null);
    setStartHour(null);
    setErrors({});
    setDirection("back");
    setStep(1);
    setMaxStep(1);
    scrollToBooking();
  }

  const calendarDays = getCalendarDays(calendarCursor, duration, selectedDate);
  const selectedDateObj = selectedDate ? new Date(selectedDate + "T00:00:00") : null;
  const selectableDays = calendarDays.filter((d) => !d.isEvent && !d.isFull).length;
  const calPrevDisabled = calendarCursor.getTime() <= startOfMonth(startOfToday()).getTime();

  const dateLabel = selectedDateObj ? formatDate(selectedDateObj) : "—";
  const timeLabel = duration && startHour !== null ? pad(startHour) + ":00–" + pad(startHour + duration.hours) + ":00" : "—";
  const fullName = personal ? ((personal.firstName || "") + " " + (personal.lastName || "")).trim() : "";

  const nextDisabled = (step === 1 && !duration) || (step === 3 && !(selectedDate && startHour !== null));

  function fieldProps(name) {
    return {
      name,
      "aria-invalid": errors[name] ? "true" : undefined,
      "aria-describedby": errors[name] ? "err-" + name : undefined,
    };
  }

  function renderError(name) {
    return errors[name] ? <span className="field-error" id={"err-" + name}>{errors[name]}</span> : null;
  }

  return (
    <section className="booking" id="rezervace" aria-labelledby="booking-heading">
      <div className="booking-wrap">
        <ol className="booking-steps" aria-label="Průběh rezervace" style={{ "--progress": (step - 1) / (STEPS.length - 1) }}>
          {STEPS.map((s) => {
            const clickable = s.n <= maxStep && s.n !== step && !isSuccess;
            return (
              <li
                key={s.n}
                className={"booking-step" + (s.n === step ? " is-active" : "") + (s.n !== step && s.n <= maxStep ? " is-done" : "")}
                data-step={s.n}
                aria-current={s.n === step ? "step" : undefined}
              >
                <button
                  type="button"
                  className="booking-step-btn"
                  disabled={!clickable}
                  aria-label={clickable ? `Zpět na krok ${s.n}: ${s.label}` : undefined}
                  onClick={() => goToStep(s.n)}
                >
                  <span className="step-num">{pad(s.n)}</span>
                  <span className="step-label">{s.label}</span>
                </button>
              </li>
            );
          })}
        </ol>

        {duration && (
          <p className="booking-mobile-summary">
            <span>{duration.label}{selectedDate ? " · " + dateLabel : ""}</span>
            <strong>{fmtPrice(duration.price)}</strong>
          </p>
        )}

        <div className="booking-layout">
          <div className={"booking-panel" + (direction === "back" ? " is-back" : "")}>
            {/* Krok 1 — délka */}
            <div className={"booking-pane" + (step === 1 ? " is-active" : "")} data-pane="1">
              <p className="pane-label" id="duration-label">Kolik chceš jezdit?</p>
              <div className="duration-grid" id="cenik" role="radiogroup" aria-labelledby="duration-label">
                {DURATIONS.map((d) => {
                  const selected = Boolean(duration && duration.hours === d.hours);
                  return (
                    <button
                      type="button"
                      key={d.hours}
                      role="radio"
                      aria-checked={selected}
                      className={"duration-card" + (selected ? " is-selected" : "")}
                      onClick={() => handleDurationSelect(d)}
                    >
                      <span className="duration-hours">{d.hours} h</span>
                      <span className="duration-label">{d.label}</span>
                      <span className="duration-price">{fmtPrice(d.price)}</span>
                    </button>
                  );
                })}
              </div>
              <div className="booking-actions">
                <span></span>
                <button className="btn-primary" type="button" disabled={nextDisabled} onClick={handleNext}>Pokračovat →</button>
              </div>
            </div>

            {/* Krok 2 — osobní údaje */}
            <div className={"booking-pane" + (step === 2 ? " is-active" : "")} data-pane="2">
              <p className="pane-label">Tvoje údaje</p>
              <div className="account-prompt">
                {user ? (
                  <>Přihlášen(a) jako {user.name} — údaje se vyplní automaticky.</>
                ) : (
                  <>
                    Máš u nás účet?{" "}
                    <button type="button" className="link-btn" onClick={() => openAuthModal("login")}>Přihlásit se</button>
                    {" "}— příště se ti údaje vyplní automaticky. Nemáš?{" "}
                    <span style={{ whiteSpace: "nowrap" }}>
                      <button type="button" className="link-btn" onClick={() => openAuthModal("register")}>Založit profil</button>.
                    </span>
                  </>
                )}
              </div>
              <form
                className="booking-form"
                id="bookingForm"
                noValidate
                ref={formRef}
                onChange={handleFormInput}
                onBlur={handleFieldBlur}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
              >
                <div className="form-row">
                  <label>Jméno
                    <input type="text" {...fieldProps("firstName")} required autoComplete="given-name" />
                    {renderError("firstName")}
                  </label>
                  <label>Příjmení
                    <input type="text" {...fieldProps("lastName")} required autoComplete="family-name" />
                    {renderError("lastName")}
                  </label>
                </div>
                <div className="form-row">
                  <label>Telefon
                    <input type="tel" {...fieldProps("phone")} required autoComplete="tel" inputMode="tel" pattern="\+?[0-9 ]{9,16}" placeholder="+420 777 123 456" />
                    {renderError("phone")}
                  </label>
                  <label>E-mail
                    <input type="email" {...fieldProps("email")} required autoComplete="email" placeholder="jan@email.cz" />
                    {renderError("email")}
                  </label>
                </div>
                <label className="form-full">Zkušenosti a řidičský level
                  <select {...fieldProps("level")} id="levelSelect" required defaultValue="">
                    <option value="" disabled>Vyber úroveň</option>
                    {LEVELS.map((l) => (
                      <option value={l} key={l}>{l}</option>
                    ))}
                  </select>
                  {renderError("level")}
                </label>
                <button type="submit" hidden tabIndex={-1} aria-hidden="true"></button>
              </form>
              <div className="booking-actions">
                <button className="btn-ghost" type="button" onClick={() => goToStep(step - 1)}>← Zpět</button>
                <button className="btn-primary" type="button" onClick={handleNext}>Pokračovat →</button>
              </div>
            </div>

            {/* Krok 3 — termín */}
            <div className={"booking-pane" + (step === 3 ? " is-active" : "")} data-pane="3">
              <p className="pane-label">Vyber termín</p>
              <div className="calendar">
                <div className="calendar-head">
                  <button
                    type="button"
                    className="calendar-nav"
                    aria-label="Předchozí měsíc"
                    disabled={calPrevDisabled}
                    onClick={() => setCalendarCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
                  >←</button>
                  <p className="calendar-month" aria-live="polite">{MONTH_NAMES[calendarCursor.getMonth()] + " " + calendarCursor.getFullYear()}</p>
                  <button
                    type="button"
                    className="calendar-nav"
                    aria-label="Následující měsíc"
                    onClick={() => setCalendarCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
                  >→</button>
                </div>
                <div className="calendar-grid" id="calGrid">
                  {selectableDays === 0 && (
                    <p className="calendar-empty-note">
                      {duration
                        ? "V tomto měsíci se trénink na " + duration.hours + " h už nikam nevejde — zkus další měsíc nebo kratší délku."
                        : "V tomto měsíci už nejsou žádné volné termíny."}
                    </p>
                  )}
                  {calendarDays.map((day) => (
                    <button
                      type="button"
                      key={day.key}
                      className={"cal-day" + (day.isEvent ? " is-event" : "") + (day.isFull ? " is-full" : "") + (day.isSelected ? " is-selected" : "")}
                      disabled={day.isEvent || day.isFull}
                      aria-pressed={day.isEvent || day.isFull ? undefined : day.isSelected}
                      aria-label={
                        day.weekday + " " + formatDate(day.date) +
                        (day.isEvent
                          ? ", obsazeno akcí: " + day.eventName
                          : day.isFull
                            ? ", trénink na " + (duration ? duration.hours : 1) + " h se nevejde"
                            : ", volno " + day.freeHours + " h z " + (DAY_END - DAY_START))
                      }
                      title={day.isEvent ? "Obsazeno akcí: " + day.eventName : day.isFull ? "Trénink na " + (duration ? duration.hours : 1) + " h se do tohoto dne nevejde" : undefined}
                      onClick={() => !day.isEvent && !day.isFull && handleDayClick(day)}
                    >
                      <span className="cal-day-weekday" aria-hidden="true">{day.weekday}</span>
                      <span className="cal-day-num" aria-hidden="true">{day.day}</span>
                      {day.isEvent ? (
                        <span className="cal-day-note" aria-hidden="true">akce</span>
                      ) : (
                        <>
                          <span className="cal-load" aria-hidden="true">
                            {day.states.map((st, i) => <i key={i} className={"is-" + st}></i>)}
                          </span>
                          <span className="cal-day-note" aria-hidden="true">{day.isFull ? "plno" : day.freeHours + " h volno"}</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
                <div className="calendar-legend">
                  <span><i className="dot dot-free"></i>Volná hodina</span>
                  <span><i className="dot dot-busy"></i>Obsazená hodina</span>
                  <span><i className="dot dot-full"></i>{duration ? "Trénink na " + duration.hours + " h se nevejde" : "Plno"}</span>
                  <span><i className="dot dot-event"></i>Akce na okruhu</span>
                </div>
              </div>
              {selectedDate && duration && (
                <div className="slot-panel">
                  <p className="pane-label">Vyber čas — {dateLabel}</p>
                  <p className="slot-hint">
                    {startHour !== null
                      ? <>Vybráno <strong>{timeLabel}</strong> ({duration.hours} h). Kliknutím na začátek výběr zrušíš.</>
                      : <>Trénink trvá <strong>{duration.hours} h</strong> — najeď na hodinu, kdy chceš začít, a uvidíš celý blok.</>}
                  </p>
                  {slotError && <p className="slot-error" role="alert">{slotError}</p>}
                  <TimePicker dateKey={selectedDate} hours={duration.hours} startHour={startHour} onSelect={handleTimeSelect} />
                </div>
              )}
              <div className="booking-actions">
                <button className="btn-ghost" type="button" onClick={() => goToStep(step - 1)}>← Zpět</button>
                <button className="btn-primary" type="button" disabled={nextDisabled} onClick={handleNext}>Pokračovat →</button>
              </div>
            </div>

            {/* Krok 4 — shrnutí a platba */}
            <div className={"booking-pane" + (step === 4 ? " is-active" : "")} data-pane="4">
              <p className="pane-label">Shrnutí rezervace</p>
              <div className="summary-card">
                <dl className="summary-row"><dt>Délka tréninku</dt><dd>{duration ? duration.label : "—"}</dd></dl>
                <dl className="summary-row"><dt>Termín</dt><dd>{dateLabel}{startHour !== null ? " · " + timeLabel : ""}</dd></dl>
                <dl className="summary-row"><dt>Jméno</dt><dd>{fullName || "—"}</dd></dl>
                <dl className="summary-row"><dt>Kontakt</dt><dd>{personal ? (personal.phone || "—") + " · " + (personal.email || "—") : "—"}</dd></dl>
                <dl className="summary-row"><dt>Řidičský level</dt><dd>{personal && personal.level ? personal.level : "—"}</dd></dl>
                <dl className="summary-row summary-total"><dt>Celkem</dt><dd>{duration ? fmtPrice(duration.price) : "—"}</dd></dl>
              </div>
              {!isSuccess ? (
                <div className="booking-actions">
                  <button className="btn-ghost" type="button" onClick={() => goToStep(step - 1)}>← Zpět</button>
                  <button className="btn-primary btn-pay" type="button" onClick={() => setIsPaymentOpen(true)}>Zaplatit online →</button>
                </div>
              ) : (
                <div className="booking-success" ref={successRef} tabIndex={-1} role="status">
                  <p className="booking-success-title">Rezervace přijata</p>
                  <p className="success-note">Platební brána je zatím jen náhled — napojíme ji v další fázi projektu.</p>
                  <button className="btn-ghost" type="button" onClick={handleNewBooking}>Nová rezervace</button>
                </div>
              )}
            </div>
          </div>

          <aside className="booking-summary-side" aria-label="Souhrn rezervace">
            <p className="pane-label">Tvoje rezervace</p>
            <div className="side-rows">
              <dl className="side-row"><dt>Délka</dt><dd>{duration ? duration.label : "—"}</dd></dl>
              {selectedDate && (
                <dl className="side-row"><dt>Termín</dt><dd>{dateLabel}{startHour !== null && duration ? " · " + timeLabel : ""}</dd></dl>
              )}
              {personal && personal.firstName && (
                <dl className="side-row"><dt>Jméno</dt><dd>{fullName}</dd></dl>
              )}
              <dl className="side-row side-total"><dt>Celkem</dt><dd>{duration ? fmtPrice(duration.price) : "—"}</dd></dl>
            </div>
          </aside>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        amountLabel={duration ? fmtPrice(duration.price) : ""}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={handlePaymentConfirm}
      />
    </section>
  );
}
