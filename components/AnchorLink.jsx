"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToTarget } from "@/lib/lenis";

/**
 * Link that smooth-scrolls (via Lenis) when the target section is on the current page,
 * and does a normal Next.js navigation otherwise (e.g. "/#book" from /about).
 */
export default function AnchorLink({ href, onClick, children, ...rest }) {
  const pathname = usePathname();

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (href.startsWith("/#") && pathname === "/") {
      const target = document.getElementById(href.slice(2));
      if (target) {
        event.preventDefault();
        window.history.pushState(null, "", href);
        // The mobile menu freezes scrolling while open; wait for it to release before scrolling.
        const menuOpen = document.documentElement.classList.contains("menu-open");
        if (menuOpen) setTimeout(() => scrollToTarget(target), 120);
        else scrollToTarget(target);
      }
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
