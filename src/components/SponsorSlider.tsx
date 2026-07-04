const sponsors = [
  { name: 'NOVA', tag: 'Platinum Partner' },
  { name: 'PULSE FM', tag: 'Media Partner' },
  { name: 'URBAN EDGE', tag: 'Lifestyle Partner' },
  { name: 'BREW CO.', tag: 'Hospitality Partner' },
  { name: 'SWIFTPAY', tag: 'Payment Partner' },
  { name: 'ORBIT', tag: 'Tech Partner' },
  { name: 'NOVA', tag: 'Platinum Partner' },
  { name: 'PULSE FM', tag: 'Media Partner' },
  { name: 'URBAN EDGE', tag: 'Lifestyle Partner' },
  { name: 'BREW CO.', tag: 'Hospitality Partner' },
  { name: 'SWIFTPAY', tag: 'Payment Partner' },
  { name: 'ORBIT', tag: 'Tech Partner' },
];

const colors = ['sticker-orange', 'sticker-purple', 'sticker-lime', 'sticker-pink'];

export default function SponsorSlider() {
  return (
    <div className="sponsor-slider-wrap">
      <div className="gaffer-tape" style={{ width: 80, height: 22, top: -11, left: '15%', transform: 'rotate(-6deg)', zIndex: 2 }} />
      <div className="sponsor-slider-track">
        {sponsors.map((s, i) => (
          <div className="sponsor-slide" key={i}>
            <span className={`sponsor-slide-name`}>{s.name}</span>
            <span className="sponsor-slide-tag">{s.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
