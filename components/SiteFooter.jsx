import AnchorLink from "./AnchorLink";
import Logo from "./Logo";
import WhatsAppLink from "./WhatsAppLink";
import { ArrowUpRight, SocialIcon, WhatsAppIcon } from "./Icons";
import { contact, site, socials, subjects } from "@/lib/site";

const sectionLinks = [
  { href: "/#subjects", label: "Subjects & services" },
  { href: "/#exam-prep", label: "Exam preparation" },
  { href: "/#pricing", label: "Pricing & packages" },
  { href: "/#resources", label: "Free resources" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#faq", label: "FAQ" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top wrap-wide">
        <div className="footer-cta">
          <p className="mono">READY WHEN YOU ARE</p>
          <h2>
            Let&rsquo;s turn <em>confusion</em> into <em>confidence.</em>
          </h2>
          <div className="footer-cta-actions">
            <AnchorLink href="/#book" className="btn btn-signal btn-lg">
              Book a free consultation <ArrowUpRight size={18} />
            </AnchorLink>
            <WhatsAppLink className="btn btn-ghost btn-lg" message="Hi, I'd like to know more about tutoring.">
              <WhatsAppIcon size={18} /> WhatsApp us
            </WhatsAppLink>
          </div>
        </div>

        <div className="footer-cols">
          <div>
            <Logo className="brand-light" />
            <p className="footer-blurb">
              {site.descriptor} for Years 7–12, taught by an experienced Mechanical Engineer.
              Perth-based, online worldwide.
            </p>
            <div className="social-row">
              {socials.map((s) => (
                <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <SocialIcon id={s.id} size={18} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Explore">
            <h3 className="mono">EXPLORE</h3>
            <ul>
              <li><AnchorLink href="/about">About the tutor</AnchorLink></li>
              {sectionLinks.map((link) => (
                <li key={link.href}><AnchorLink href={link.href}>{link.label}</AnchorLink></li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mono">SUBJECTS</h3>
            <ul>
              {subjects.map((s) => (
                <li key={s.id}><AnchorLink href="/#subjects">{s.name}</AnchorLink></li>
              ))}
              <li>Years 7–12</li>
            </ul>
          </div>

          <div>
            <h3 className="mono">CONTACT</h3>
            <ul>
              <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
              <li>{contact.phoneDisplay}</li>
              <li>{site.location.city}, {site.location.region}</li>
              <li>Online across Australia &amp; worldwide</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-word" aria-hidden="true">{site.shortName}</div>

      <div className="footer-bottom wrap-wide">
        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <span>{site.descriptor}</span>
        <AnchorLink href="/#home">Back to top ↑</AnchorLink>
      </div>
    </footer>
  );
}
