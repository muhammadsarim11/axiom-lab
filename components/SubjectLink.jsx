"use client";

import AnchorLink from "./AnchorLink";

/** Scrolls to the booking form and pre-selects the given subject. */
export default function SubjectLink({ subject, children, ...props }) {
  return (
    <AnchorLink
      href="/#book"
      onClick={() =>
        window.dispatchEvent(new CustomEvent("axiom:select-subject", { detail: subject }))
      }
      {...props}
    >
      {children}
    </AnchorLink>
  );
}
