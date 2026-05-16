import { useState } from 'react';
import './Skills.css';

const skillGroups = [
  {
    category: 'Languages',
    color: '#6366f1',
    skills: ['Java', 'JavaScript', 'SQL', 'TypeScript'],
  },
  {
    category: 'Frontend',
    color: '#06b6d4',
    skills: ['React.js', 'HTML5', 'CSS3'],
  },
  {
    category: 'Backend',
    color: '#10b981',
    skills: ['Spring Boot', 'REST APIs', 'Hibernate', 'JDBC', 'MVC'],
  },
  {
    category: 'Tools',
    color: '#e879f9',
    skills: ['Git', 'GitHub', 'Maven', 'IntelliJ', 'VS Code', 'MySQL'],
  },
];

export default function Skills() {
  const [active, setActive] = useState(0);
  const group = skillGroups[active];

  return (
    <section className="section" id="skills">
      <div className="container">
        <div className="section-tag">Technical Skills</div>
        <h2 className="section-title">My Tech Stack</h2>

        <div className="sk-layout">

          {/* Tabs */}
          <div className="sk-tabs">
            {skillGroups.map((g, i) => (
              <button
                key={i}
                className={`sk-tab ${i === active ? 'active' : ''}`}
                style={{ '--c': g.color }}
                onClick={() => setActive(i)}
              >
                <span className="sk-tab-bar" />
                <span className="sk-tab-num">0{i + 1}</span>
                <span className="sk-tab-name">{g.category}</span>
                <span className="sk-tab-count">{g.skills.length}</span>
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="sk-panel" key={active} style={{ '--c': group.color }}>
            <div className="sk-panel-top">
              <span className="sk-panel-label">{group.category}</span>
              <span className="sk-panel-count">{group.skills.length} skills</span>
            </div>
            <div className="sk-tags">
              {group.skills.map((s, i) => (
                <span
                  className="sk-tag"
                  key={i}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
