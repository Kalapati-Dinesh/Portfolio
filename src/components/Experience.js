import { FiBriefcase } from 'react-icons/fi';
import './Experience.css';

const experiences = [
  {
    role: 'Java Full Stack Development Training',
    company: 'KodNest',
    period: 'August 2025 – May 2026',
    type: 'Training',
    points: [
      'Completed intensive hands-on training covering Core Java, OOPs, Collections, JDBC, Hibernate, Spring Boot, SQL, HTML, CSS, JavaScript, and React.js.',
      'Developed real-world mini projects and web applications using Java and Spring Boot.',
      'Built RESTful APIs, implemented MVC architecture, and integrated backend systems with databases.',
      'Practiced problem-solving, debugging, and coding standards through daily assignments.',
      'Worked with Git, Maven, Eclipse/STS, and MySQL Workbench.',
    ],
  },
];

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-tag">Experience</div>
        <h2 className="section-title">My Journey</h2>
        <div className="timeline">
          {experiences.map((exp, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-dot"><FiBriefcase /></div>
              <div className="timeline-card">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <p className="timeline-company">{exp.company}</p>
                  </div>
                  <div className="timeline-right">
                    <span className="timeline-period">{exp.period}</span>
                    <span className="timeline-type">{exp.type}</span>
                  </div>
                </div>
                <ul className="timeline-points">
                  {exp.points.map((p, j) => (
                    <li key={j}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
