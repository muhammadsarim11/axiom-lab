import Link from "next/link";
import { site } from "@/lib/site";

/** Drafting-compass "A": a nod to engineering drawing, and to the brand name. */
export function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="1.5" />
      <path d="M24 9 14 38M24 9l10 29" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18.4 28h11.2" stroke="var(--signal)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="24" cy="9" r="2.6" fill="var(--signal)" />
    </svg>
  );
}

export default function Logo({ onClick, className = "" }) {
  return (
    <Link href="/" className={`brand ${className}`} onClick={onClick} aria-label={`${site.name} home`}>
      <LogoMark />
      <span className="brand-copy">
        <strong>{site.shortName.toUpperCase()}</strong>
        <small>TUTORING</small>
      </span>
    </Link>
  );
}
