import { FiBook } from 'react-icons/fi';
import './Education.css';

const education = [
  {
    degree: 'Bachelor of Technology',
    field: 'Electronics and Communication Engineering',
    institution: 'Sri Venkateswara College of Engineering',
    location: 'Tirupati, Andhra Pradesh',
    period: '2021 – 2025',
    score: 'CGPA: 9.50',
    color: '#6366f1',
  },
  {
    degree: 'Senior Secondary Education',
    field: 'Science (MPC)',
    institution: 'Sri Vema Junior College',
    location: 'Naidupeta, Andhra Pradesh',
    period: '2019 – 2021',
    score: 'CGPA: 9.42',
    color: '#06b6d4',
  },
];

export default function Education() {
  return (
    <section className="section" id="education">
      <div className="container">
        <div className="section-tag">Education</div>
        <h2 className="section-title">Academic Background</h2>
        <div className="edu-grid">
          {education.map((e, i) => (
            <div className="edu-card" key={i} style={{ '--e-color': e.color }}>
              <div className="edu-icon"><FiBook /></div>
              <div className="edu-body">
                <div className="edu-header">
                  <div>
                    <h3 className="edu-degree">{e.degree}</h3>
                    <p className="edu-field">{e.field}</p>
                  </div>
                  <span className="edu-score">{e.score}</span>
                </div>
                <p className="edu-institution">{e.institution}</p>
                <div className="edu-footer">
                  <span className="edu-location">📍 {e.location}</span>
                  <span className="edu-period">{e.period}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
