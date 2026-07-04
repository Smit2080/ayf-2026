const photos = [
  { rotate: -3, bg: 'var(--gallery-1)' },
  { rotate: 2, bg: 'var(--gallery-2)' },
  { rotate: 4, bg: 'var(--gallery-3)' },
  { rotate: -2, bg: 'var(--gallery-4)' },
  { rotate: 1, bg: 'var(--gallery-5)' },
  { rotate: -4, bg: 'var(--gallery-6)' },
  { rotate: 3, bg: 'var(--gallery-7)' },
  { rotate: -1, bg: 'var(--gallery-8)' },
];

export default function Gallery() {
  return (
    <section className="gallery reveal" id="gallery">
      <div className="wrap">
        <div className="gallery-head">
          <span className="sticker sticker-lime" style={{ marginBottom: 0 }}>Memories</span>
          <h2>Memories that stay</h2>
          <a className="btn btn-ghost" href="#gallery">View gallery --</a>
        </div>
        <div className="polagrid">
          {photos.map((p, i) => (
            <div className="pola" key={i} style={{ transform: `rotate(${p.rotate}deg)` }}>
              <div className="shot" style={{ backgroundImage: p.bg, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
