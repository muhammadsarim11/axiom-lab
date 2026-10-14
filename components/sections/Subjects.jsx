import Scene3D from "../Scene3D";
import SubjectArt from "../SubjectArt";
import SubjectLink from "../SubjectLink";
import { ArrowUpRight } from "../Icons";
import { services, subjects } from "@/lib/site";

export default function Subjects() {
  return (
    <section className="subjects section" id="subjects" aria-labelledby="subjects-title">
      <div className="wrap-wide">
        <div className="section-head">
          <p className="mono eyebrow" data-reveal>SUBJECTS &amp; SERVICES</p>
          <h2 id="subjects-title" className="display" data-split>
            Three subjects. One-to-one. <em>Built around the student.</em>
          </h2>
          <p className="lede" data-reveal>
            Choose the subject where a little clarity makes the biggest difference. Every lesson is
            matched to the school syllabus, the student&rsquo;s pace and what&rsquo;s coming up next.
          </p>
        </div>

        <div className="stack">
          {subjects.map((subject, i) => (
            <article
              className={`subject-card subject-${subject.id}`}
              data-spot
              data-stack-card
              style={{ "--i": i }}
              key={subject.id}
            >
              <header className="sc-head mono">
                <span>0{i + 1} / {subject.kicker.toUpperCase()}</span>
                <span>YEARS 7–12</span>
              </header>

              <div className="sc-body">
                <div className="sc-copy">
                  <h3>{subject.name}</h3>
                  <p>{subject.blurb}</p>
                  <SubjectLink subject={subject.name} className="btn btn-dark">
                    Book {subject.name} <ArrowUpRight size={16} />
                  </SubjectLink>
                </div>
                <div className="sc-art">
                  <SubjectArt id={subject.id} />
                  <Scene3D kind={subject.id} />
                </div>
              </div>

              <div className="sc-levels">
                {subject.levels.map((level) => (
                  <div className="sc-level" key={level.band}>
                    <h4 className="mono">{level.band.toUpperCase()}</h4>
                    <ul>
                      {level.topics.map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="services">
          <h3 className="mono eyebrow" data-reveal>HOW WE CAN WORK TOGETHER</h3>
          <ul className="services-list" data-reveal-group>
            {services.map((service, i) => (
              <li data-spot key={service.title}>
                <span className="mono">0{i + 1}</span>
                <h4>{service.title}</h4>
                <p>{service.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
