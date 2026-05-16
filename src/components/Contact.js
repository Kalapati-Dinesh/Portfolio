import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import './Contact.css';

const contactInfo = [
  { icon: <MdEmail />, label: 'Email', value: 'dineshkalapati0498@gmail.com', href: 'mailto:dineshkalapati0498@gmail.com' },
  { icon: <MdPhone />, label: 'Phone', value: '+91-9398961435', href: 'tel:+919398961435' },
  { icon: <MdLocationOn />, label: 'Location', value: 'Tirupati, Andhra Pradesh', href: null },
  { icon: <FaGithub />, label: 'GitHub', value: 'github.com/Kalapati-Dinesh', href: 'https://github.com/Kalapati-Dinesh' },
  { icon: <FaLinkedin />, label: 'LinkedIn', value: 'linkedin.com/in/dinesh2745', href: 'https://www.linkedin.com/in/dinesh2745' },
];

export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-tag">Contact</div>
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-wrapper">
          <div className="contact-left">
            <h3 className="contact-heading">Let's Work Together</h3>
            <p className="contact-text">
              I'm currently open to new opportunities. Whether you have a project in mind,
              a job opportunity, or just want to say hi — my inbox is always open!
            </p>
            <div className="contact-items">
              {contactInfo.map((c, i) => (
                <div className="contact-item" key={i}>
                  <div className="contact-icon">{c.icon}</div>
                  <div>
                    <div className="contact-label">{c.label}</div>
                    {c.href
                      ? <a href={c.href} className="contact-value" target="_blank" rel="noreferrer">{c.value}</a>
                      : <span className="contact-value">{c.value}</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form className="contact-form" onSubmit={e => e.preventDefault()}>
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input type="text" placeholder="Job Opportunity / Project" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows="5" placeholder="Tell me about your project or opportunity..." />
            </div>
            <button type="submit" className="btn-primary form-btn">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
}
