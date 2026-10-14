import AnchorLink from "../AnchorLink";
import { ArrowRight } from "../Icons";
import { pillars } from "@/lib/site";

export default function Approach() {
  return (
    <section className="approach section" id="approach" aria-labelledby="approach-title">
      <div className="wrap-wide">
        <p className="mono eyebrow" data-reveal>THE AXIOM APPROACH</p>

        <h2 id="approach-title" className="statement" data-scrub>
          Getting the answer matters. Understanding why matters more. Once a concept clicks, the
          next problem stops being a mystery and becomes just another bit of engineering.
        </h2>

        <div className="pillars" data-reveal-group>
          {pillars.map((pillar) => (
            <article className="pillar" data-spot key={pillar.n}>
              <span className="mono pillar-n">{pillar.n}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>

        <AnchorLink href="/about" className="link-arrow" data-reveal>
          Meet your tutor <ArrowRight size={18} />
        </AnchorLink>
      </div>
    </section>
  );
}
