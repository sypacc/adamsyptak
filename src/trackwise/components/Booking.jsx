import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import PaymentModal from "./PaymentModal.jsx";
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
  bookedHoursForDate,
  nameForSlot,
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

function getCalendarDays(cursor, duration, selectedDate) {
  const today = startOfToday();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const days = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    const key = dateKey(d);
    const isPast = d.getTime() < today.getTime();
    const eventName = EVENTS[key];
    const starts = !eventName && !isPast && isOpenDay(d) ? validStartHours(key, duration ? duration.hours : 1) : [];
    if (!eventName && (isPast || !isOpenDay(d) || starts.length === 0)) continue;
    const booked = eventName ? [] : bookedHoursForDate(key);
    days.push({
      day,
      key,
      date: d,
      weekday: WEEKDAY_LABELS[(d.getDay() + 6) % 7],
      isEvent: !!eventName,
      eventName: eventName || null,
      isBusy: !eventName && booked.length > 0,
      isSelected: selectedDate === key,
    });
  }
  return days;
}

function getSlots(date, duration, startHour) {
  if (!date || !duration) return [];
  const key = dateKey(date);
  const booked = bookedHoursForDate(key);
  const hours = duration.hours;
  const validStarts = validStartHours(key, hours);
  const rangeStart = startHour !== null && validStarts.indexOf(startHour) !== -1 ? startHour : null;
  const rangeEnd = rangeStart !== null ? rangeStart + hours - 1 : null;
  const slots = [];
  for (let h = DAY_START; h < DAY_END; h++) {
    const isTaken = booked.indexOf(h) !== -1;
    const canStart = validStarts.indexOf(h) !== -1;
    const inRange = rangeStart !== null && h >= rangeStart && h <= rangeEnd && !isTaken;
    slots.push({
      hour: h,
      label: pad(h) + ":00–" + pad(h + 1) + ":00",
      isTaken,
      canStart,
      inRange,
      isRangeStart: inRange && h === rangeStart,
      takenName: isTaken && !inRange ? nameForSlot(key, h) : null,
    });
  }
  return slots;
}

export default function Booking() {
  const { user, openAuthModal } = useAuth();
  const { setReservation, clearReservation } = useCart();

  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [duration, setDuration] = useState(null);
  const [personal, setPersonal] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [calendarCursor, setCalendarCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(null);
  const [startHour, setStartHour] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formRef = useRef(null);
  const successRef = useRef(null);

  function goToStep(n) {
    setStep(n);
    setMaxStep((m) => Math.max(m, n));
    const section = document.getElementById("rezervace");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Duration changing (without a fresh date click) can leave a previously
  // picked start hour out of range for the new length — silently drop it
  // so the slot grid never shows a selection that overruns a booked hour.
  useEffect(() => {
    if (startHour === null || !selectedDate || !duration) return;
    if (validStartHours(selectedDate, duration.hours).indexOf(startHour) === -1) {
      setStartHour(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, selectedDate]);

  // Logging in while on step 2 prefills empty name/email fields, same as
  // the 'tw-auth-changed' listener in the original vanilla version.
  useEffect(() => {
    const form = formRef.current;
    if (!user || !form) return;
    const firstNameInput = form.elements.firstName;
    const emailInput = form.elements.email;
    if (firstNameInput && !firstNameInput.value) firstNameInput.value = user.name;
    if (emailInput && !emailInput.value) emailInput.value = user.email;
    setIsFormValid(form.checkValidity());
  }, [user]);

  // Reservation flows into the shared cart as soon as step 4 has
  // everything it needs, so the cart badge/modal reflect it immediately.
  useEffect(() => {
    if (step !== 4 || !duration || !selectedDate || startHour === null) return;
    const dateObj = new Date(selectedDate + "T00:00:00");
    setReservation({
      durationLabel: "Trénink — " + duration.label,
      price: duration.price,
      dateLabel: pad(dateObj.getDate()) + ". " + (dateObj.getMonth() + 1) + ". " + dateObj.getFullYear(),
      timeLabel: pad(startHour) + ":00–" + pad(startHour + duration.hours) + ":00",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, duration, selectedDate, startHour]);

  useEffect(() => {
    if (isSuccess && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isSuccess]);

  function handleDurationSelect(d) {
    setDuration(d);
    setSelectedDate(null);
    setStartHour(null);
    clearReservation();
  }

  function handleFormInput() {
    const form = formRef.current;
    if (!form) return;
    setIsFormValid(form.checkValidity());
    const fd = new FormData(form);
    setPersonal({
      firstName: fd.get("firstName") || "",
      lastName: fd.get("lastName") || "",
      phone: fd.get("phone") || "",
      email: fd.get("email") || "",
      level: fd.get("level") || "",
    });
  }

  function handleNext() {
    if (step === 2) handleFormInput();
    goToStep(step + 1);
  }

  function handleDayClick(day) {
    if (selectedDate === day.key) {
      setSelectedDate(null);
      setStartHour(null);
    } else {
      setSelectedDate(day.key);
      setStartHour(null);
    }
  }

  function handleSlotClick(slot) {
    if (slot.inRange && slot.isRangeStart) {
      setStartHour(null);
    } else if (slot.canStart) {
      setStartHour(slot.hour);
    }
  }

  function handlePaymentConfirm() {
    setIsPaymentOpen(false);
    clearReservation();
    setIsSuccess(true);
  }

  const calendarDays = getCalendarDays(calendarCursor, duration, selectedDate);
  const selectedDateObj = selectedDate ? new Date(selectedDate + "T00:00:00") : null;
  const slots = getSlots(selectedDateObj, duration, startHour);
  const today = startOfToday();
  const calPrevDisabled = calendarCursor.getTime() <= startOfMonth(today).getTime();

  const dateLabel = selectedDateObj
    ? pad(selectedDateObj.getDate()) + ". " + (selectedDateObj.getMonth() + 1) + ". " + selectedDateObj.getFullYear()
    : "—";
  const timeLabel = duration && startHour !== null ? pad(startHour) + ":00–" + pad(startHour + duration.hours) + ":00" : "—";

  const nextDisabled =
    (step === 1 && !duration) ||
    (step === 2 && !isFormValid) ||
    (step === 3 && !(selectedDate && startHour !== null));

  return (
    <section className="booking" id="rezervace" aria-labelledby="booking-heading">
      <div className="booking-wrap">
        <ol className="booking-steps" aria-label="Průběh rezervace">
          {STEPS.map((s) => {
            const clickable = s.n <= maxStep;
            return (
              <li
                key={s.n}
                className={
                  "booking-step" +
                  (s.n === step ? " is-active" : "") +
                  (s.n !== step && s.n <= maxStep ? " is-done" : "")
                }
                data-step={s.n}
                tabIndex={0}
                onClick={() => clickable && goToStep(s.n)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && clickable) {
                    e.preventDefault();
                    goToStep(s.n);
                  }
                }}
              >
                <span className="step-num">{pad(s.n)}</span>
                <span className="step-label">{s.label}</span>
              </li>
            );
          })}
        </ol>

        <div className="booking-layout">
          <div className="booking-panel">
            {/* Krok 1 — délka */}
            <div className={"booking-pane" + (step === 1 ? " is-active" : "")} data-pane="1">
              <p className="pane-label">Kolik chceš jezdit?</p>
              <div className="duration-grid" id="cenik">
                {DURATIONS.map((d) => (
                  <button
                    type="button"
                    key={d.hours}
                    className={"duration-card" + (duration && duration.hours === d.hours ? " is-selected" : "")}
                    onClick={() => handleDurationSelect(d)}
                  >
                    <span className="duration-hours">{d.hours} h</span>
                    <span className="duration-label">{d.label}</span>
                    <span className="duration-price">{fmtPrice(d.price)}</span>
                  </button>
                ))}
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
                    <button type="button" className="link-btn" onClick={() => openAuthModal("register")}>Založit profil</button>.
                  </>
                )}
              </div>
              <form className="booking-form" id="bookingForm" noValidate ref={formRef} onInput={handleFormInput}>
                <div className="form-row">
                  <label>Jméno
                    <input type="text" name="firstName" required autoComplete="given-name" />
                  </label>
                  <label>Příjmení
                    <input type="text" name="lastName" required autoComplete="family-name" />
                  </label>
                </div>
                <div className="form-row">
                  <label>Telefon
                    <input type="tel" name="phone" required autoComplete="tel" />
                  </label>
                  <label>E-mail
                    <input type="email" name="email" required autoComplete="email" />
                  </label>
                </div>
                <label className="form-full">Zkušenosti a řidičský level
                  <select name="level" id="levelSelect" required defaultValue="">
                    <option value="" disabled>Vyber úroveň</option>
                    {LEVELS.map((l) => (
                      <option value={l} key={l}>{l}</option>
                    ))}
                  </select>
                </label>
              </form>
              <div className="booking-actions">
                <button className="btn-ghost" type="button" onClick={() => goToStep(step - 1)}>← Zpět</button>
                <button className="btn-primary" type="button" disabled={nextDisabled} onClick={handleNext}>Pokračovat →</button>
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
                  <p className="calendar-month">{MONTH_NAMES[calendarCursor.getMonth()] + " " + calendarCursor.getFullYear()}</p>
                  <button
                    type="button"
                    className="calendar-nav"
                    aria-label="Následující měsíc"
                    onClick={() => setCalendarCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
                  >→</button>
                </div>
                <div className="calendar-grid" id="calGrid">
                  {calendarDays.length === 0 && (
                    <p className="calendar-empty-note">V tomto měsíci už nejsou žádné volné termíny.</p>
                  )}
                  {calendarDays.map((day) => (
                    <button
                      type="button"
                      key={day.key}
                      className={
                        "cal-day" +
                        (day.isEvent ? " is-event" : "") +
                        (day.isBusy ? " is-busy" : "") +
                        (day.isSelected ? " is-selected" : "")
                      }
                      disabled={day.isEvent}
                      title={day.isEvent ? "Obsazeno akcí: " + day.eventName : undefined}
                      onClick={() => !day.isEvent && handleDayClick(day)}
                    >
                      <span className="cal-day-weekday">{day.weekday}</span>
                      <span className="cal-day-num">{day.day}</span>
                      {!day.isEvent && <span className="cal-dot"></span>}
                    </button>
                  ))}
                </div>
                <div className="calendar-legend">
                  <span><i className="dot dot-free"></i>Volno</span>
                  <span><i className="dot dot-busy"></i>Částečně obsazeno</span>
                  <span><i className="dot dot-event"></i>Obsazeno akcí</span>
                </div>
              </div>
              <div className="slot-panel" hidden={!selectedDate}>
                <p className="pane-label">Volné časy — {dateLabel}</p>
                <div className="slot-grid">
                  {slots.map((slot) => (
                    <button
                      type="button"
                      key={slot.hour}
                      className={
                        "slot-btn" +
                        (slot.inRange ? " is-in-range" : "") +
                        (slot.isRangeStart ? " is-range-start" : "")
                      }
                      disabled={!slot.inRange && !slot.canStart}
                      onClick={() => handleSlotClick(slot)}
                    >
                      {slot.label}
                      {slot.takenName && <span className="slot-taken-note">Obsazeno ({slot.takenName})</span>}
                    </button>
                  ))}
                </div>
              </div>
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
                <dl className="summary-row"><dt>Jméno</dt><dd>{personal ? ((personal.firstName || "") + " " + (personal.lastName || "")).trim() || "—" : "—"}</dd></dl>
                <dl className="summary-row"><dt>Kontakt</dt><dd>{personal ? (personal.phone || "—") + " · " + (personal.email || "—") : "—"}</dd></dl>
                <dl className="summary-row"><dt>Řidičský level</dt><dd>{personal && personal.level ? personal.level : "—"}</dd></dl>
                <dl className="summary-row summary-total"><dt>Celkem</dt><dd>{duration ? fmtPrice(duration.price) : "—"}</dd></dl>
              </div>
              <div className="booking-actions" hidden={isSuccess}>
                <button className="btn-ghost" type="button" onClick={() => goToStep(step - 1)}>← Zpět</button>
                <button className="btn-primary btn-pay" type="button" onClick={() => setIsPaymentOpen(true)}>Zaplatit online →</button>
              </div>
              <div className="booking-success" hidden={!isSuccess} ref={successRef}>
                <p>✓ Rezervace přijata</p>
                <p className="success-note">Platební brána je zatím jen náhled — napojíme ji v další fázi projektu.</p>
              </div>
            </div>
          </div>

          <aside className="booking-summary-side" aria-label="Souhrn rezervace">
            <p className="pane-label">Tvoje rezervace</p>
            <dl className="side-rows">
              <dl className="side-row"><dt>Délka</dt><dd>{duration ? duration.label : "—"}</dd></dl>
              {selectedDate && (
                <dl className="side-row"><dt>Termín</dt><dd>{dateLabel}{startHour !== null && duration ? " · " + timeLabel : ""}</dd></dl>
              )}
              {personal && personal.firstName && (
                <dl className="side-row"><dt>Jméno</dt><dd>{(personal.firstName + " " + personal.lastName).trim()}</dd></dl>
              )}
              <dl className="side-row side-total"><dt>Celkem</dt><dd>{duration ? fmtPrice(duration.price) : "—"}</dd></dl>
            </dl>
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
