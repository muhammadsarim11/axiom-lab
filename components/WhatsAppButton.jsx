import WhatsAppLink from "./WhatsAppLink";
import { WhatsAppIcon } from "./Icons";

export default function WhatsAppButton() {
  return (
    <WhatsAppLink
      className="wa-float"
      message="Hi, I'd like to know more about tutoring. Can we chat?"
      aria-label="Chat with us on WhatsApp"
    >
      <span className="wa-float-ring" aria-hidden="true" />
      <WhatsAppIcon size={26} />
      <span className="wa-float-label">Chat on WhatsApp</span>
    </WhatsAppLink>
  );
}
