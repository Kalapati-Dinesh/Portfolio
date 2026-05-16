import { FiGithub, FiExternalLink } from 'react-icons/fi';
import './Projects.css';

const projects = [
  {
    title: 'HireFlow – Recruitment Management System',
    period: 'April 2026',
    desc: 'A full-stack job portal with employer job posting, candidate application, and end-to-end application tracking with JWT-based authentication.',
    points: [
      'Implemented 15+ RESTful API endpoints for JWT-based authentication, job management, and application tracking using Spring Boot.',
      'Built a responsive React.js UI integrated with backend APIs.',
      'Designed a normalized MySQL schema using Hibernate ORM mappings.',
    ],
    tags: ['Java', 'Spring Boot', 'React.js', 'MySQL', 'JWT', 'Hibernate', 'REST API'],
    color: '#6366f1',
    github: 'https://github.com/KalapatiDinesh',
  },
  {
    title: 'Traffic Sign Recognition System (CNN-Based)',
    period: 'May 2025',
    desc: 'A real-time image classification system using Convolutional Neural Networks (CNN) for traffic sign detection with a responsive web interface.',
    points: [
      'Developed CNN model for real-time image classification of traffic signs.',
      'Built backend services using Java and RESTful APIs for model inference.',
      'Integrated OpenCV for image preprocessing and real-time detection.',
      'Implemented SQL-based database for storing predictions and application data.',
    ],
    tags: ['Java', 'CNN', 'OpenCV', 'REST API', 'SQL', 'HTML', 'CSS'],
    color: '#06b6d4',
    github: 'https://github.com/KalapatiDinesh',
  },
];

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-tag">Projects</div>
        <h2 className="section-title">What I've Built</h2>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div className="project-card" key={i} style={{ '--p-color': p.color }}>
              <div className="project-top">
                <div className="project-glow" style={{ background: p.color }} />
                <div className="project-header">
                  <div>
                    <h3 className="project-title">{p.title}</h3>
                    <span className="project-period">{p.period}</span>
                  </div>
                  <div className="project-links">
                    <a href={p.github} target="_blank" rel="noreferrer" title="View on GitHub"><FiGithub size={18} /></a>
                    {p.live && <a href={p.live} target="_blank" rel="noreferrer" title="Live Demo"><FiExternalLink size={18} /></a>}
                  </div>
                </div>
                <p className="project-desc">{p.desc}</p>
                <ul className="project-points">
                  {p.points.map((pt, j) => <li key={j}>{pt}</li>)}
                </ul>
              </div>
              <div className="project-tags">
                {p.tags.map((t, j) => (
                  <span className="project-tag" key={j}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
