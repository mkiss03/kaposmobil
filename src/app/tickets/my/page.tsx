"use client";
export default function MyTickets(){
  const items = (typeof window !== "undefined")
    ? JSON.parse(localStorage.getItem("kaposvar_tickets") || "[]")
    : [];
  return (
    <div className="section">
      <h1 className="h1">Jegyeim</h1>
      {items.length===0 && <div className="card" style={{padding:16}}>Még nincs jegyed.</div>}
      <div style={{display:"grid", gap:12, marginTop:12}}>
        {items.map((t:any, i:number)=>(
          <div key={i} className="card" style={{padding:16}}>
            <div style={{fontWeight:900}}>{t.title}</div>
            <div className="small">📅 {t.date}</div>
            <div className="small">📍 {t.venue}</div>
            <div className="small">Helyek: {t.seats.join(", ")}</div>
            <button className="btn" style={{marginTop:8}}>QR megnyitása (demó)</button>
          </div>
        ))}
      </div>
    </div>
  );
}
