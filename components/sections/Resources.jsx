import Accordion from "../Accordion";
import AnchorLink from "../AnchorLink";
import { ArrowRight } from "../Icons";
import { resources } from "@/lib/site";

export default function Resources() {
  const items = resources.map((resource) => ({
    id: resource.id,
    header: (
      <>
        <span className="mono tag">{resource.tag.toUpperCase()}</span>
        <span className="acc-name">{resource.title}</span>
      </>
    ),
    content: (
      <>
        <p>{resource.intro}</p>
        <ol className="steps">
          {resource.steps.map(([label, text]) => (
            <li key={label}>
              <strong>{label}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ol>
        <ul className="formula-chips" aria-label="Key formulas">
          {resource.formulas.map((formula) => (
            <li key={formula}>{formula}</li>
          ))}
        </ul>
      </>
    ),
  }));

  return (
    <section className="resources section" id="resources" aria-labelledby="resources-title">
      <div className="wrap-wide resources-grid">
        <div className="resources-intro">
          <p className="mono eyebrow eyebrow-light" data-reveal>FREE RESOURCES</p>
          <h2 id="resources-title" className="display" data-split>
            A little clarity, <em>right when you need it.</em>
          </h2>
          <p className="lede" data-reveal>
            Quick, practical study routines you can use tonight. Printable worksheets and topic
            guides are on the way.
          </p>
          <AnchorLink href="/#book" className="link-arrow link-arrow-light" data-reveal>
            Request a topic <ArrowRight size={18} />
          </AnchorLink>
        </div>
        <Accordion items={items} variant="resource" />
      </div>
    </section>
  );
}
