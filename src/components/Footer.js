import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FiHeart } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-copy">
          Made with <FiHeart className="heart" /> by Kalapati Dinesh
        </p>
        <div className="footer-socials">
          <a href="https://github.com/Kalapati-Dinesh" target="_blank" rel="noreferrer"><FaGithub /></a>
          <a href="https://www.linkedin.com/in/dinesh2745" target="_blank" rel="noreferrer"><FaLinkedin /></a>
          <a href="mailto:dineshkalapati0498@gmail.com"><MdEmail /></a>
        </div>
      </div>
    </footer>
  );
}
