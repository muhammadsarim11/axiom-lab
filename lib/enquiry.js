// Shared (client + server) enquiry helpers: sanitising, validation and the plain-text message.
import { years, states, formats, subjects as subjectList } from "./site";

const SUBJECT_NAMES = subjectList.map((s) => s.name);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s()-]{5,19}$/;

const text = (value, max) =>
  typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max) : "";

export function cleanEnquiry(raw = {}) {
  return {
    name: text(raw.name, 80),
    email: text(raw.email, 120),
    phone: text(raw.phone, 24),
    year: text(raw.year, 20),
    state: text(raw.state, 60),
    format: text(raw.format, 30),
    subjects: Array.isArray(raw.subjects)
      ? raw.subjects.map((s) => text(s, 30)).filter((s) => SUBJECT_NAMES.includes(s))
      : [],
    message:
      typeof raw.message === "string"
        ? raw.message.replace(/\r\n/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, " ").trim().slice(0, 1000)
        : "",
  };
}

export function validateEnquiry(v) {
  const errors = {};
  if (v.name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(v.email)) errors.email = "Please enter a valid email address.";
  if (v.phone && !PHONE_RE.test(v.phone)) errors.phone = "Please enter a valid phone number.";
  if (!years.includes(v.year)) errors.year = "Please select a year level.";
  if (!states.includes(v.state)) errors.state = "Please select a state or territory.";
  if (!v.subjects.length) errors.subjects = "Please choose at least one subject.";
  if (v.format && !formats.includes(v.format)) errors.format = "Please choose a lesson format.";
  return errors;
}

export function enquiryText(v) {
  const lines = [
    "Hi, I'd like to book a free consultation.",
    "",
    `Name: ${v.name}`,
    `Student year: ${v.year}`,
    `State / territory: ${v.state}`,
    `Subjects: ${v.subjects.join(", ")}`,
  ];
  if (v.format) lines.push(`Lesson format: ${v.format}`);
  if (v.phone) lines.push(`Phone: ${v.phone}`);
  lines.push(`Email: ${v.email}`);
  if (v.message) lines.push("", `Notes: ${v.message}`);
  return lines.join("\n");
}
