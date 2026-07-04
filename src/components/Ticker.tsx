const words = ['LEADERSHIP', 'CREATIVITY', 'COMMUNITY', 'INNOVATION', 'MUSIC', 'SPORTS', 'TECHNOLOGY', 'ART', 'DANCE'];

export default function Ticker() {
  return (
    <div className="ticker">
      <div className="ticker-track">
        {words.map(w => <span key={w}>{w}<span>--</span></span>)}
        {words.map(w => <span key={`dup-${w}`}>{w}<span>--</span></span>)}
      </div>
    </div>
  );
}
