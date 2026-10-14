import AnchorLink from "../AnchorLink";
import { ArrowUpRight } from "../Icons";
import { testimonials } from "@/lib/site";

export default function Testimonials() {
  const hasReviews = testimonials.length > 0;
  return (
    <section className="testimonials section" id="testimonials" aria-labelledby="testimonials-title">
      <div className="wrap-wide">
        <div className="section-head section-head-split">
          <div>
            <p className="mono eyebrow" data-reveal>TESTIMONIALS</p>
            <h2 id="testimonials-title" className="display" data-split>
              Confidence looks <em>different on everyone.</em>
            </h2>
          </div>
          <p className="lede" data-reveal>
            {hasReviews
              ? "Kind words from students and families."
              : "Every student's journey is their own, and yours starts with a conversation."}
          </p>
        </div>

        {hasReviews ? (
          <div className="quotes" data-reveal-group>
            {testimonials.map((t) => (
              <figure className="quote" key={t.quote}>
                <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption>
                  <strong>{t.name}</strong>
                  {t.detail && <span>{t.detail}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="quote-empty" data-reveal>
            <p className="quote-mark" aria-hidden="true">&ldquo;</p>
            <div>
              <h3>Student stories are coming soon.</h3>
              <p>
                We&rsquo;re currently welcoming new students. Book a free consultation and help
                write the first success story.
              </p>
            </div>
            <AnchorLink href="/#book" className="btn btn-dark">
              Start the conversation <ArrowUpRight size={16} />
            </AnchorLink>
          </div>
        )}
      </div>
    </section>
  );
}
