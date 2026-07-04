const words = ['LEADERSHIP', 'CREATIVITY', 'COMMUNITY', 'INNOVATION', 'MUSIC', 'SPORTS', 'TECHNOLOGY', 'ART', 'DANCE'];

export default function Ticker() {
  return (
    <div className="ticker">
      <div className="ticker-track">
        {words.flatMap(w => [<span key={w}>{w}</span>, <span key={`sep-${w}`}>--</span>])}
        {words.flatMap(w => [<span key={`dup-${w}`}>{w}</span>, <span key={`dup-sep-${w}`}>--</span>])}
      </div>
    </div>
  );
}
