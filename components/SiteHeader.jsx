"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import AnchorLink from "./AnchorLink";
import { ArrowUpRight, SocialIcon, WhatsAppIcon } from "./Icons";
import WhatsAppLink from "./WhatsAppLink";
import { getLenis } from "@/lib/lenis";
import { contact, navLinks, socials } from "@/lib/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  const close = () => setOpen(false);

  // Condense on scroll, and hide while scrolling down / reveal when scrolling up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > lastY.current && y > 480);
      lastY.current = y;
    };
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Lock scrolling while the mobile menu is open; close it with Escape.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("menu-open");
    getLenis()?.stop();
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.classList.remove("menu-open");
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`site-header${scrolled ? " is-scrolled" : ""}${hidden && !open ? " is-hidden" : ""}${open ? " is-open" : ""}`}
    >
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="header-inner wrap-wide">
        <Logo onClick={close} />

        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <AnchorLink
              key={link.href}
              href={link.href}
              aria-current={link.href === pathname ? "page" : undefined}
            >
              {link.label}
            </AnchorLink>
          ))}
        </nav>

        <AnchorLink href="/#book" className="btn btn-signal header-cta">
          Book a free consultation <ArrowUpRight size={16} />
        </AnchorLink>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="menu-toggle-label">{open ? "Close" : "Menu"}</span>
          <span className="menu-toggle-lines" aria-hidden="true" />
        </button>
      </div>

      <div className="mobile-menu" id="mobile-menu" inert={!open}>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navLinks.map((link, index) => (
            <AnchorLink
              key={link.href}
              href={link.href}
              onClick={close}
              style={{ "--d": `${index * 55 + 120}ms` }}
              aria-current={link.href === pathname ? "page" : undefined}
            >
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              {link.label}
            </AnchorLink>
          ))}
        </nav>
        <div className="mobile-foot">
          <AnchorLink href="/#book" className="btn btn-signal btn-lg" onClick={close}>
            Book a free consultation <ArrowUpRight size={18} />
          </AnchorLink>
          <WhatsAppLink className="btn btn-ghost btn-lg" message="Hi, I'd like to know more about tutoring.">
            <WhatsAppIcon size={18} /> WhatsApp
          </WhatsAppLink>
          <div className="mobile-meta">
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <div className="social-row">
              {socials.map((s) => (
                <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <SocialIcon id={s.id} size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
