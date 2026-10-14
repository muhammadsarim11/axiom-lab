import AnchorLink from "../AnchorLink";
import { ArrowUpRight, CheckIcon } from "../Icons";
import { howItWorks, packages } from "@/lib/site";

export default function Pricing() {
  return (
    <section className="pricing section" id="pricing" aria-labelledby="pricing-title">
      <div className="wrap-wide">
        <div className="section-head section-head-split">
          <div>
            <p className="mono eyebrow" data-reveal>PRICING &amp; PACKAGES</p>
            <h2 id="pricing-title" className="display" data-split>
              The right support, <em>for the right moment.</em>
            </h2>
          </div>
          <p className="lede" data-reveal>
            Simple, personalised options. Fees depend on year level, subject and format, and are
            shared openly in your free consultation.
          </p>
        </div>

        <div className="packages" data-reveal-group>
          {packages.map((pkg) => (
            <article className={`package${pkg.featured ? " is-featured" : ""}`} data-spot key={pkg.id}>
              <div className="package-top">
                <span className="mono">{pkg.note.toUpperCase()}</span>
              </div>
              <h3>{pkg.name}</h3>
              <p className="package-price">
                {pkg.price ?? <span className="enquire">Enquire for rates</span>}
              </p>
              <p className="package-summary">{pkg.summary}</p>
              <ul>
                {pkg.features.map((feature) => (
                  <li key={feature}><CheckIcon size={16} /> {feature}</li>
                ))}
              </ul>
              <AnchorLink href="/#book" className={`btn ${pkg.featured ? "btn-signal" : "btn-dark"}`}>
                {pkg.cta} <ArrowUpRight size={16} />
              </AnchorLink>
            </article>
          ))}
        </div>

        <ol className="process" data-reveal-group>
          {howItWorks.map((step) => (
            <li data-spot key={step.n}>
              <span className="process-n">{step.n}</span>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>

        <p className="pricing-note" data-reveal>
          Not sure which suits you?{" "}
          <AnchorLink href="/#book" className="inline-link">Ask for a recommendation</AnchorLink>.
        </p>
      </div>
    </section>
  );
}
