export default function Footer() {
  return (
    <footer id="contact">
      <div className="footer-watermark">AYF</div>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="nav-logo" href="#top">
              <img src="/AYF_logo_clean.png" alt="AYF" style={{ height: 32, width: 'auto' }} />
            </a>
            <p>A city-wide celebration of youth, talent, creativity, and leadership. Built by students, for students.</p>
            <div className="footer-social">
              <a href="https://www.instagram.com/amravatiyouthfest/" target="_blank" rel="noopener" aria-label="Instagram">IG</a>
              <a href="#" aria-label="YouTube">YT</a>
              <a href="#" aria-label="Twitter/X">X</a>
            </div>
          </div>
          <div className="footer-cols">
            <div>
              <h4>Explore</h4>
              <a href="#about">About us</a>
              <a href="#events">Event details</a>
              <a href="#gallery">Gallery</a>
              <a href="#faq">FAQ</a>
            </div>
            <div>
              <h4>Join</h4>
              <a href="/register?type=competition">Register</a>
              <a href="/register?type=competition">Auditions</a>
              <a href="/register?type=volunteer">Volunteer</a>
            </div>
            <div>
              <h4>Connect</h4>
              <a href="https://www.instagram.com/amravatiyouthfest/" target="_blank" rel="noopener">Instagram</a>
              <a href="mailto:hello@amravatiyouthfest.com">Email</a>
              <a href="#">WhatsApp</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Amravati Youth Festival. Organized by Navrashtra Youth Foundation.</span>
          <span>AYF 2026</span>
        </div>
      </div>
    </footer>
  );
}
