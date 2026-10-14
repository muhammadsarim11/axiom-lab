import { NextResponse } from "next/server";
import { cleanEnquiry, enquiryText, validateEnquiry } from "@/lib/enquiry";
import { site } from "@/lib/site";

// Light in-memory throttle (per server instance): 5 enquiries / 10 minutes / IP.
const hits = new Map();
function throttled(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const data = cleanEnquiry(body);
  const errors = validateEnquiry(data);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Validation failed", errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  // Email delivery isn't configured yet: tell the client so it can offer WhatsApp / email instead.
  if (!apiKey || !to) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const subject = `New enquiry: ${data.name} (${data.year}, ${data.subjects.join("/")})`.replace(/[\r\n]+/g, " ");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM_EMAIL || `${site.name} <onboarding@resend.dev>`,
      to: [to],
      reply_to: data.email,
      subject,
      text: enquiryText(data),
    }),
  }).catch(() => null);

  if (!response || !response.ok) {
    return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
