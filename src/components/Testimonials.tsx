const voices = [
  { quote: 'AYF changed me. It gave me a platform to grow and lead.', initials: 'RS', name: 'Rohan S.', role: 'Volunteer', color: 'var(--lime)', textColor: 'var(--ink)' },
  { quote: 'Performing at AYF was the best experience of my life.', initials: 'SP', name: 'Sneha P.', role: 'Performer', color: 'var(--orange)', textColor: 'var(--ink)' },
  { quote: 'The energy, the people, the memories -- absolutely unmatched.', initials: 'VK', name: 'Viraj K.', role: 'Participant', color: 'var(--purple)', textColor: 'var(--white)' },
];

export default function Testimonials() {
  return (
    <section className="voices reveal">
      <div className="wrap">
        <span className="sticker sticker-pink" style={{ marginBottom: 14 }}>Testimonials</span>
        <h2>Voices of AYF</h2>
        <div className="voice-grid">
          {voices.map((v) => (
            <div className="voice-card" key={v.initials}>
              <p>{v.quote}</p>
              <div className="voice-who">
                <div className="voice-avatar" style={{ background: v.color, color: v.textColor }}>{v.initials}</div>
                <div><b>{v.name}</b><span>{v.role}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
