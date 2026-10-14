import Image from "next/image";
import AnchorLink from "@/components/AnchorLink";
import JsonLd from "@/components/JsonLd";
import WhatsAppLink from "@/components/WhatsAppLink";
import { LogoMark } from "@/components/Logo";
import {
  ArrowUpRight,
  CheckIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  SocialIcon,
  WhatsAppIcon,
} from "@/components/Icons";
import { breadcrumbSchema, personSchema } from "@/lib/schema";
import { contact, hasWhatsApp, site, socials, telLink, tutor } from "@/lib/site";

const pageTitle = `About ${tutor.name} | ${tutor.role}`;
const pageDescription = `Meet ${tutor.name}, an experienced Mechanical Engineer offering personalised Maths, Physics and Chemistry tutoring for Years 7–12 in Perth and online across Australia.`;

// A page-level openGraph/twitter object replaces the parent's wholesale, so repeat the shared fields.
export const metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    locale: "en_AU",
    siteName: site.name,
    url: "/about",
    title: pageTitle,
    description: pageDescription,
  },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
};

const values = [
  "Patient, one-to-one support at the student's pace",
  "Concepts before memorisation, always",
  "Real engineering examples that make ideas stick",
  "Clear worked solutions and honest feedback",
];

const expect = [
  ["Start where you are", "A short diagnostic finds the real gaps, so no time is wasted on what's already solid."],
  ["Understand the why", "Every formula is tied back to the idea behind it, so it can be rebuilt, not just recalled."],
  ["Practise with purpose", "Targeted questions at the right difficulty, with the working made visible."],
  ["Build independence", "The goal is a student who can tackle the next problem alone."],
];

export default function AboutPage() {
  const phone = telLink();

  return (
    <>
      <JsonLd data={personSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About the tutor", path: "/about" },
        ])}
      />

      <section className="about-hero" aria-labelledby="about-title">
        <div className="wrap-wide about-hero-grid">
          <div className="about-hero-copy">
            <p className="mono eyebrow" data-hero-fade>ABOUT THE TUTOR</p>
            <h1 id="about-title" className="hero-title about-title">
              <span className="h-mask"><span className="h-line" data-hero-line>Engineer by training.</span></span>{" "}
              <span className="h-mask"><span className="h-line" data-hero-line><em>Teacher by instinct.</em></span></span>
            </h1>
            <p className="hero-sub" data-hero-fade>
              I&rsquo;m {tutor.name}, a Mechanical Engineer who loves showing students that the
              subjects they find hardest can make complete sense.
            </p>
            <div className="hero-actions" data-hero-fade>
              <AnchorLink href="/#book" className="btn btn-signal btn-lg">
                Book a free consultation <ArrowUpRight size={18} />
              </AnchorLink>
              <WhatsAppLink className="btn btn-ghost btn-lg" message="Hi, I found your website and would like to chat about tutoring.">
                <WhatsAppIcon size={18} /> Message me
              </WhatsAppLink>
            </div>
          </div>

          <div className="about-portrait" data-hero-fade>
            <div className="portrait-frame" data-tilt>
              {tutor.photo ? (
                <Image src={tutor.photo} alt={`${tutor.name}, ${tutor.role}`} fill sizes="(max-width: 900px) 90vw, 440px" priority />
              ) : (
                <div className="portrait-placeholder" role="img" aria-label={`Portrait of ${tutor.name} (photo coming soon)`}>
                  <LogoMark size={120} />
                  <span className="portrait-initials">SMA</span>
                </div>
              )}
            </div>
            <div className="portrait-caption">
              <strong>{tutor.name}</strong>
              <span>{tutor.role}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-story section" aria-labelledby="story-title">
        <div className="wrap-wide story-grid">
          <div>
            <p className="mono eyebrow" data-reveal>THE PERSON BEHIND THE FORMULAS</p>
          </div>
          <div className="story-copy">
            <h2 id="story-title" className="display" data-split>
              Learning should feel like a door opening, <em>not a wall.</em>
            </h2>
            <p data-reveal>
              Engineering is Maths, Physics and Chemistry put to work: bridges that carry loads,
              engines that turn heat into motion, materials chosen for how their atoms bond. That
              practical lens shapes every lesson I teach. We start with the idea, make each step
              clear, then work through problems together until the method feels natural.
            </p>
            <p data-reveal>
              Every student arrives with a different starting point. My job is to meet them there,
              find the explanation that finally clicks, and build the confidence to take on the next
              challenge independently.
            </p>
            <ul className="values" data-reveal>
              {values.map((value) => (
                <li key={value}><CheckIcon size={16} /> {value}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="credentials" aria-label="Background and focus">
        <div className="wrap-wide credentials-grid" data-reveal-group>
          {tutor.credentials.map((item) => (
            <article data-spot key={item.title}>
              <p className="mono">{item.label.toUpperCase()}</p>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section expect" aria-labelledby="expect-title">
        <div className="wrap-wide">
          <div className="section-head">
            <p className="mono eyebrow" data-reveal>WHAT TO EXPECT</p>
            <h2 id="expect-title" className="display" data-split>
              Lessons that feel <em>clear, calm and focused.</em>
            </h2>
          </div>
          <ol className="expect-list" data-reveal-group>
            {expect.map(([title, text], i) => (
              <li data-spot key={title}>
                <span className="mono">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="contact-details section" id="contact" aria-labelledby="contact-title">
        <div className="wrap-wide contact-grid">
          <div>
            <p className="mono eyebrow eyebrow-light" data-reveal>GET IN TOUCH</p>
            <h2 id="contact-title" className="display" data-split>
              Talk to <em>{tutor.name.split(" ").slice(0, 2).join(" ")}</em> directly.
            </h2>
            <p className="lede" data-reveal>
              Prefer a quick message to a form? Reach out any way that suits you. Every enquiry
              is answered personally.
            </p>
          </div>

          <div className="contact-card" data-reveal>
            <ul>
              <li>
                <PhoneIcon size={20} />
                <span>
                  <small>Phone</small>
                  {phone ? <a href={phone}>{contact.phoneDisplay}</a> : contact.phoneDisplay}
                </span>
              </li>
              <li>
                <WhatsAppIcon size={20} />
                <span>
                  <small>WhatsApp</small>
                  <WhatsAppLink message="Hi, I'd like to chat about tutoring.">
                    {hasWhatsApp() ? contact.phoneDisplay : "Message via the booking form"}
                  </WhatsAppLink>
                </span>
              </li>
              <li>
                <MailIcon size={20} />
                <span>
                  <small>Email</small>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </span>
              </li>
              <li>
                <PinIcon size={20} />
                <span>
                  <small>Location</small>
                  {site.location.city}, {site.location.region}. Online worldwide.
                </span>
              </li>
              <li>
                <ClockIcon size={20} />
                <span>
                  <small>Availability</small>
                  {contact.hours}
                </span>
              </li>
            </ul>
            <div className="contact-card-foot">
              <div className="social-row">
                {socials.map((s) => (
                  <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <SocialIcon id={s.id} size={18} />
                  </a>
                ))}
              </div>
              <AnchorLink href="/#book" className="btn btn-signal">
                Book a free consultation <ArrowUpRight size={16} />
              </AnchorLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
