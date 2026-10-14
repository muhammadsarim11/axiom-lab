"use client";

import { useEffect, useState } from "react";
import Select from "./Select";
import { ArrowUpRight, CheckIcon, MailIcon, WhatsAppIcon } from "./Icons";
import { contact, formats, hasWhatsApp, states, subjects as subjectList, waLink, years } from "@/lib/site";
import { cleanEnquiry, enquiryText, validateEnquiry } from "@/lib/enquiry";
import { scrollToTarget } from "@/lib/lenis";

const subjectNames = subjectList.map((s) => s.name);

const empty = {
  name: "",
  email: "",
  phone: "",
  year: "",
  state: "",
  subjects: [],
  format: "Online",
  message: "",
};

export default function BookingForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | failed
  const [delivered, setDelivered] = useState(false);
  const [sentText, setSentText] = useState("");

  const set = (key) => (value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };
  const onInput = (key) => (event) => set(key)(event.target.value);

  // The result panel is shorter than the form, so bring it back into view.
  useEffect(() => {
    if (status !== "sent" && status !== "failed") return;
    const frame = requestAnimationFrame(() => scrollToTarget(".booking-form-wrap", { duration: 0.9 }));
    return () => cancelAnimationFrame(frame);
  }, [status]);

  // "Book Physics" buttons elsewhere on the page pre-select a subject.
  useEffect(() => {
    const onSelectSubject = (event) => {
      const subject = event.detail;
      if (!subjectNames.includes(subject)) return;
      setValues((current) =>
        current.subjects.includes(subject)
          ? current
          : { ...current, subjects: [...current.subjects, subject] },
      );
      setErrors((current) => ({ ...current, subjects: undefined }));
    };
    window.addEventListener("axiom:select-subject", onSelectSubject);
    return () => window.removeEventListener("axiom:select-subject", onSelectSubject);
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get("company")) return; // honeypot

    const data = cleanEnquiry(values);
    const found = validateEnquiry(data);
    setErrors(found);
    if (Object.keys(found).length) {
      // Focus the first invalid control once the error state has rendered.
      requestAnimationFrame(() =>
        document
          .querySelector(".booking-card .has-error :is(input:not([type=hidden]), textarea, button)")
          ?.focus(),
      );
      return;
    }

    setStatus("sending");
    setSentText(enquiryText(data));
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "failed");
      setDelivered(Boolean(result.delivered));
      setStatus("sent");
    } catch {
      setDelivered(false);
      setStatus("failed");
    }
  };

  if (status === "sent" || status === "failed") {
    const mail = `mailto:${contact.email}?subject=${encodeURIComponent("Free consultation enquiry")}&body=${encodeURIComponent(sentText)}`;
    return (
      <div className="booking-card booking-done" role="status" aria-live="polite">
        <span className="done-badge">
          <CheckIcon size={24} />
        </span>
        <p className="mono">{delivered ? "ENQUIRY RECEIVED" : "ONE LAST STEP"}</p>
        <h3>{delivered ? "Thank you, we'll be in touch." : "Your enquiry is ready to send."}</h3>
        <p className="done-text">
          {delivered
            ? "Your details have been sent. Expect a personal reply soon to arrange your free consultation."
            : status === "failed"
              ? "We couldn't send that automatically. Please send it with one tap using WhatsApp or email."
              : "Send it with one tap using WhatsApp or email so it reaches us straight away."}
        </p>
        <div className="done-actions">
          {hasWhatsApp() && (
            <a className="btn btn-signal" href={waLink(sentText)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={18} /> {delivered ? "Message on WhatsApp too" : "Send on WhatsApp"}
            </a>
          )}
          {!delivered && (
            <a className="btn btn-ghost-dark" href={mail}>
              <MailIcon size={18} /> Send by email
            </a>
          )}
        </div>
        <button
          type="button"
          className="text-button"
          onClick={() => {
            setValues(empty);
            setStatus("idle");
          }}
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="booking-card" onSubmit={onSubmit} noValidate>
      <div className="form-head">
        <p className="mono">FREE CONSULTATION REQUEST</p>
        <h3>Tell us about the student.</h3>
      </div>

      <div className="form-grid">
        <div className={`field${errors.name ? " has-error" : ""}`}>
          <label className="field-label" htmlFor="field-name">Your name</label>
          <input id="field-name" className="input" value={values.name} onChange={onInput("name")} placeholder="Parent or student name" autoComplete="name" aria-invalid={errors.name ? true : undefined} />
          {errors.name && <span className="field-error" role="alert">{errors.name}</span>}
        </div>
        <div className={`field${errors.email ? " has-error" : ""}`}>
          <label className="field-label" htmlFor="field-email">Email</label>
          <input id="field-email" type="email" className="input" value={values.email} onChange={onInput("email")} placeholder="you@example.com" autoComplete="email" aria-invalid={errors.email ? true : undefined} />
          {errors.email && <span className="field-error" role="alert">{errors.email}</span>}
        </div>

        <Select label="Student's year level" name="year" options={years} value={values.year} onChange={set("year")} placeholder="Select year" error={errors.year} />
        <Select label="State / territory" name="state" options={states} value={values.state} onChange={set("state")} placeholder="Select location" error={errors.state} />

        <div className="field-wide">
          <Select label="Subjects" hint="Choose one or more" name="subjects" options={subjectNames} value={values.subjects} onChange={set("subjects")} multiple placeholder="Select subjects" error={errors.subjects} />
        </div>

        <fieldset className="field field-wide segmented">
          <legend className="field-label">Lesson format</legend>
          <div className="segmented-options">
            {formats.map((format) => (
              <label key={format} className={values.format === format ? "is-selected" : ""}>
                <input type="radio" name="format" value={format} checked={values.format === format} onChange={() => set("format")(format)} />
                {format}
              </label>
            ))}
          </div>
        </fieldset>

        <div className={`field field-wide${errors.phone ? " has-error" : ""}`}>
          <label className="field-label" htmlFor="field-phone">Phone / WhatsApp <em>Optional</em></label>
          <input id="field-phone" type="tel" className="input" value={values.phone} onChange={onInput("phone")} placeholder="+61 4XX XXX XXX" autoComplete="tel" aria-invalid={errors.phone ? true : undefined} />
          {errors.phone && <span className="field-error" role="alert">{errors.phone}</span>}
        </div>

        <div className="field field-wide">
          <label className="field-label" htmlFor="field-message">Anything we should know? <em>Optional</em></label>
          <textarea id="field-message" className="input textarea" rows={3} value={values.message} onChange={onInput("message")} placeholder="A topic, an upcoming exam, a goal…" maxLength={1000} />
        </div>

        {/* Honeypot: hidden from people, irresistible to bots. */}
        <div className="hp" aria-hidden="true">
          <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
        </div>
      </div>

      <button type="submit" className="btn btn-signal btn-lg form-submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Request my free consultation"} <ArrowUpRight size={18} />
      </button>
      <p className="form-note">Free, no obligation. Your details are only used to reply to your enquiry.</p>
    </form>
  );
}
