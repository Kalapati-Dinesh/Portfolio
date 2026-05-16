
import { Link } from 'react-scroll';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        <h1 className="hero-name">Kalapati <span>Dinesh</span></h1>
        <p className="hero-desc">
          Aspiring Java Full Stack Developer passionate about building scalable web applications
          with clean code and modern technologies.
        </p>
        <div className="hero-actions">
          <Link to="projects" smooth duration={600} offset={-70} className="btn-primary">
            View My Work
          </Link>
          <Link to="contact" smooth duration={600} offset={-70} className="btn-outline">
            Get In Touch
          </Link>
        </div>
        <div className="hero-socials">
          <a href="https://github.com/Kalapati-Dinesh" target="_blank" rel="noreferrer"><FaGithub /></a>
          <a href="https://www.linkedin.com/in/dinesh2745" target="_blank" rel="noreferrer"><FaLinkedin /></a>
          <a href="mailto:dineshkalapati0498@gmail.com"><MdEmail /></a>
        </div>
      </div>

    </section>
  );
}
