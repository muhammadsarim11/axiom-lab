import AnchorLink from "../AnchorLink";
import HeroArt from "../HeroArt";
import WhatsAppLink from "../WhatsAppLink";
import { ArrowUpRight, WhatsAppIcon } from "../Icons";
import { site, tutor } from "@/lib/site";

export default function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-grid wrap-wide">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="eb-rule" data-eb-rule aria-hidden="true" />
            <p className="eb-text mono">
              <span className="eb-mask"><span data-eb-text>Personalised STEM Tuition</span></span>
              <span className="eb-mask eb-sep" aria-hidden="true"><span data-eb-text>/</span></span>
              <span className="eb-mask"><span data-eb-text>Years 7–12</span></span>
            </p>
          </div>

          <h1 id="hero-title" className="hero-title">
            <span className="h-mask"><span className="h-line" data-hero-line>From confusion</span></span>{" "}
            <span className="h-mask"><span className="h-line" data-hero-line>to <em>confidence.</em></span></span>
          </h1>

          <p className="hero-sub" data-hero-fade>
            Personalised <strong>Maths, Physics &amp; Chemistry</strong> tuition, led by an
            experienced Mechanical Engineer. Perth-based, online across Australia and worldwide.
          </p>

          <div className="hero-actions" data-hero-fade>
            <AnchorLink href="/#book" className="btn btn-signal btn-lg">
              Book a free consultation <ArrowUpRight size={18} />
            </AnchorLink>
            <WhatsAppLink
              className="btn btn-ghost btn-lg"
              message="Hi, I'd like to book a free consultation for tutoring."
            >
              <WhatsAppIcon size={18} /> Chat on WhatsApp
            </WhatsAppLink>
          </div>

          <ul className="hero-points" data-hero-fade>
            <li>Conceptual understanding</li>
            <li>Problem-solving</li>
            <li>Real-world applications</li>
          </ul>
        </div>

        <div className="hero-visual" data-hero-fade>
          <HeroArt />
        </div>
      </div>

      <div className="hero-foot wrap-wide" data-hero-fade>
        <dl>
          <div><dt>LEVELS</dt><dd>Years 7–12</dd></div>
          <div><dt>SUBJECTS</dt><dd>Maths · Physics · Chemistry</dd></div>
          <div><dt>LOCATION</dt><dd>{site.location.city}, WA + Online</dd></div>
          <div><dt>TUTOR</dt><dd>{tutor.name}</dd></div>
        </dl>
      </div>
    </section>
  );
}
