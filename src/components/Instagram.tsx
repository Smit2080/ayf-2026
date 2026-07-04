const cards = ['var(--insta-1)', 'var(--insta-2)', 'var(--insta-3)'];

export default function Instagram() {
  return (
    <section className="insta reveal">
      <div className="wrap">
        <div className="insta-head">
          <span className="sticker sticker-purple" style={{ marginBottom: 0 }}>Social</span>
          <h2>Follow the Fest</h2>
          <a className="btn btn-outline" href="https://www.instagram.com/amravatiyouthfest/" target="_blank" rel="noopener">@amravatiyouthfest --</a>
        </div>
        <div className="insta-grid">
          {cards.map((bg, i) => (
            <div className="insta-card" key={i} style={{ backgroundImage: bg }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>Latest Post</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
