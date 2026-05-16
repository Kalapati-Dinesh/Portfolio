import { FiCode, FiServer, FiDatabase, FiGithub } from 'react-icons/fi';
import './About.css';

const highlights = [
  { icon: <FiCode />, label: 'Frontend', value: 'React.js, HTML, CSS, JS' },
  { icon: <FiServer />, label: 'Backend', value: 'Java, Spring Boot, REST APIs' },
  { icon: <FiDatabase />, label: 'Database', value: 'MySQL, Hibernate, JDBC' },
  { icon: <FiGithub />, label: 'Tools', value: 'Git, GitHub, IntelliJ, VS Code' },
];

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-tag">About Me</div>
        <h2 className="section-title">Who I Am</h2>
        <div className="about-grid">
          <div className="about-text">
            <p>
              I'm a passionate <span className="highlight">Java Full Stack Developer</span> based in
              Tirupati, Andhra Pradesh. With a strong foundation in both frontend and backend technologies,
              I love building end-to-end web applications that are fast, scalable, and user-friendly.
            </p>
            <p>
              I completed my B.Tech in Electronics and Communication Engineering from
              <span className="highlight"> Sri Venkateswara College of Engineering</span> with a CGPA of 9.5,
              and I'm currently undergoing intensive Full Stack training at KodNest.
            </p>
            <p>
              When I'm not coding, I'm exploring new technologies, solving DSA problems, and working on
              real-world projects to sharpen my skills.
            </p>
            <div className="about-stats">
              <div className="stat"><span className="stat-num">9.5</span><span className="stat-label">CGPA</span></div>
              <div className="stat"><span className="stat-num">2+</span><span className="stat-label">Projects</span></div>
              <div className="stat"><span className="stat-num">10+</span><span className="stat-label">Technologies</span></div>
            </div>
          </div>
          <div className="about-cards">
            {highlights.map((h, i) => (
              <div className="about-card" key={i}>
                <div className="about-card-icon">{h.icon}</div>
                <div>
                  <div className="about-card-label">{h.label}</div>
                  <div className="about-card-value">{h.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
