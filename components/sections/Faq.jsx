import Accordion from "../Accordion";
import AnchorLink from "../AnchorLink";
import { ArrowRight } from "../Icons";
import { faqs } from "@/lib/site";

export default function Faq() {
  const items = faqs.map((faq, i) => ({
    id: String(i),
    header: <span className="acc-name">{faq.q}</span>,
    content: <p>{faq.a}</p>,
  }));

  return (
    <section className="faq section" id="faq" aria-labelledby="faq-title">
      <div className="wrap-wide faq-grid">
        <div className="faq-intro">
          <p className="mono eyebrow" data-reveal>GOOD TO KNOW</p>
          <h2 id="faq-title" className="display" data-split>
            Questions? <em>Start here.</em>
          </h2>
          <p className="lede" data-reveal>
            Can&rsquo;t find your answer? Send a quick note and we&rsquo;ll help you figure it out.
          </p>
          <AnchorLink href="/#book" className="link-arrow" data-reveal>
            Ask a question <ArrowRight size={18} />
          </AnchorLink>
        </div>
        <Accordion items={items} variant="faq" />
      </div>
    </section>
  );
}
