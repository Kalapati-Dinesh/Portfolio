import { FiAward, FiExternalLink } from 'react-icons/fi';
import './Certificates.css';

const certs = [
  {
    title: 'Java Full Stack Development',
    issuer: 'KodNest',
    desc: 'Comprehensive training in Java, Spring Boot, React.js, SQL, and full-stack development practices.',
    color: '#6366f1',
    file: '/certificates/java-fullstack.pdf',
  },
  {
    title: 'Web Developer',
    issuer: 'Rveiya Dynamics Pvt. Ltd',
    desc: 'Hands-on web development experience covering frontend and backend technologies.',
    color: '#10b981',
    file: '/certificates/web-developer.pdf',
  },
];

export default function Certificates() {
  return (
    <section className="section" id="certificates">
      <div className="container">
        <div className="section-tag">Certifications</div>
        <h2 className="section-title">Certificates</h2>
        <div className="certs-grid">
          {certs.map((c, i) => (
            <a
              className="cert-card"
              key={i}
              style={{ '--c-color': c.color }}
              href={c.file}
              target="_blank"
              rel="noreferrer"
            >
              <div className="cert-icon"><FiAward /></div>
              <h3 className="cert-title">{c.title}</h3>
              <p className="cert-issuer">{c.issuer}</p>
              <p className="cert-desc">{c.desc}</p>
              <span className="cert-view"><FiExternalLink size={13} /> View Certificate</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
