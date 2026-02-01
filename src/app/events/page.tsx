"use client";
import Link from "next/link";

const EVENTS = [
  { id: "szinhaz",  title: "Színház est",   date: "2026-02-14 19:00", venue: "Kaposvári Csiky Gergely Színház", price: 3500 },
  { id: "koncert",  title: "Városi koncert",date: "2026-03-01 18:30", venue: "Kaposvári Szabadtéri Színpad",    price: 3000 },
];

export default function Page() {
  return (
    <div className="section">
      <h1 className="h1">Események</h1>
      <p className="small">Fedezd fel és vásárolj jegyeket (demó)</p>
      <div style={{display:"grid", gap:12, marginTop:12}}>
        {EVENTS.map(e=>(
          <Link key={e.id} href={`/events/${e.id}`} className="card" style={{padding:16, display:"block"}}>
            <div style={{fontWeight:900}}>{e.title}</div>
            <div className="small" style={{marginTop:4}}>📅 {e.date}</div>
            <div className="small">📍 {e.venue}</div>
            <div style={{marginTop:8, fontWeight:900, color:"#1e66f5"}}>{e.price.toLocaleString("hu-HU")} Ft/jegy →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export { EVENTS };
