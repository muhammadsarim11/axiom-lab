import { waLink, hasWhatsApp } from "@/lib/site";

/** Anchor to WhatsApp (new tab) when a number is configured; otherwise falls back to the booking form. */
export default function WhatsAppLink({ message, children, ...props }) {
  const external = hasWhatsApp();
  return (
    <a
      href={waLink(message)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
    </a>
  );
}
