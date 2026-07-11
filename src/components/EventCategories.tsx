export default function EventCategories() {
  return (
    <section className="categories reveal" id="events">
      <div className="wrap">
        <div className="cat-head">
          <span className="sticker sticker-pink" style={{ marginBottom: 14 }}>Categories</span>
          <h2>Explore. Participate. <span className="shine">Shine.</span></h2>
          <p style={{ fontSize: 13, color: 'rgba(247,247,247,0.5)', marginBottom: 36 }}>Five competitions open to all residents of Amravati &amp; Vidarbha. Ages 16-35.</p>
        </div>
        <div className="cat-grid">
          <div className="cat-tile cat-1"><div className="cat-bg" style={{ backgroundImage: 'url(\'/science-exhibition-banner.png\')' }} /><div className="paint-accent" style={{ background: 'var(--purple)' }} /><span className="lbl">Science Exhibition</span></div>
          <div className="cat-tile cat-2"><div className="cat-bg" style={{ backgroundImage: 'url(\'/youth-parliament-banner.png\')' }} /><div className="paint-accent" style={{ background: 'var(--orange)' }} /><span className="lbl">Youth Parliament</span></div>
          <div className="cat-tile cat-3"><div className="cat-bg" style={{ backgroundImage: 'url(\'/startup-competition-banner.png\')' }} /><div className="paint-accent" style={{ background: 'var(--teal)' }} /><span className="lbl">Startup Competition</span></div>
          <div className="cat-tile cat-4"><div className="cat-bg" style={{ backgroundImage: 'url(\'/amravtis-got-talent-banner.png\')' }} /><div className="paint-accent" style={{ background: 'var(--pink)' }} /><span className="lbl">Amravati&apos;s Got Talent</span></div>
          <div className="cat-tile cat-5"><div className="cat-bg" style={{ backgroundImage: 'url(\'/reel-competition-banner.png\')' }} /><span className="lbl">Reel Competition</span></div>
        </div>
      </div>
    </section>
  );
}
