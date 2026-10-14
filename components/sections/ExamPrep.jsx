import AnchorLink from "../AnchorLink";
import { ArrowUpRight, CheckIcon } from "../Icons";
import { examFor, examSteps } from "@/lib/site";

export default function ExamPrep() {
  return (
    <section className="exam section" id="exam-prep" aria-labelledby="exam-title">
      <div className="wrap-wide exam-grid">
        <div className="exam-intro">
          <p className="mono eyebrow eyebrow-light" data-reveal>EXAM PREPARATION</p>
          <h2 id="exam-title" className="display" data-split>
            Walk into the exam <em>ready, not rattled.</em>
          </h2>
          <p className="lede" data-reveal>
            Focused revision that makes the most of limited time, so students know what to expect,
            how to approach each question and where the marks are.
          </p>
          <ul className="exam-for" data-reveal>
            {examFor.map((item) => (
              <li key={item}><CheckIcon size={16} /> {item}</li>
            ))}
          </ul>
          <AnchorLink href="/#book" className="btn btn-signal" data-reveal>
            Plan an exam session <ArrowUpRight size={16} />
          </AnchorLink>
        </div>

        <ol className="exam-steps">
          {examSteps.map((step) => (
            <li className="exam-step" data-step key={step.n}>
              <span className="exam-n">{step.n}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
