import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import './Navbar.css';

const links = ['about', 'skills', 'experience', 'projects', 'education', 'contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    setLight(!light);
    document.body.classList.toggle('light');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <ul className={`nav-links ${open ? 'open' : ''}`}>
        {links.map(l => (
          <li key={l}>
            <Link
              to={l} smooth="easeInQuad" duration={200} offset={-70}
              spy={true}
              activeClass="nav-active"
              onClick={() => setOpen(false)}
              data-text={l.charAt(0).toUpperCase() + l.slice(1)}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </Link>
          </li>
        ))}
        <li>
          <a href={process.env.PUBLIC_URL + '/certificates/resume.pdf'} className="nav-resume" target="_blank" rel="noreferrer">Resume</a>
        </li>
      </ul>
      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {light ? <FiMoon /> : <FiSun />}
        </button>
        <button className="hamburger" onClick={() => setOpen(!open)}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
}
