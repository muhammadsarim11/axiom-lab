import BookingForm from "../BookingForm";
import WhatsAppLink from "../WhatsAppLink";
import { CheckIcon, MailIcon, PinIcon, SocialIcon, WhatsAppIcon } from "../Icons";
import { contact, site, socials } from "@/lib/site";

export default function Booking() {
  return (
    <section className="booking section" id="book" aria-labelledby="book-title">
      <div className="wrap-wide booking-grid">
        <div className="booking-copy">
          <p className="mono eyebrow eyebrow-light" data-reveal>BOOK A FREE CONSULTATION</p>
          <h2 id="book-title" className="display" data-split>
            Let&rsquo;s make things <em>click.</em>
          </h2>
          <p className="lede" data-reveal>
            Tell us a little about the student. We&rsquo;ll start with a free, no-pressure
            conversation and recommend a plan that fits.
          </p>

          <ul className="booking-points" data-reveal>
            <li><CheckIcon size={16} /> A plan tailored to the student</li>
            <li><CheckIcon size={16} /> Perth, Australia-wide &amp; online worldwide</li>
            <li><CheckIcon size={16} /> No commitment to get started</li>
          </ul>

          <div className="contact-list" data-reveal>
            <WhatsAppLink className="contact-row" message="Hi, I'd like to book a free consultation.">
              <WhatsAppIcon size={20} />
              <span><small>WhatsApp</small>{contact.phoneDisplay}</span>
            </WhatsAppLink>
            <a className="contact-row" href={`mailto:${contact.email}`}>
              <MailIcon size={20} />
              <span><small>Email</small>{contact.email}</span>
            </a>
            <div className="contact-row">
              <PinIcon size={20} />
              <span><small>Location</small>{site.location.city}, {site.location.region} · Online worldwide</span>
            </div>
          </div>

          <div className="social-row" data-reveal>
            {socials.map((s) => (
              <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                <SocialIcon id={s.id} size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="booking-form-wrap" data-reveal>
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
