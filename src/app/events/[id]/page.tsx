"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EVENTS } from "../page";

const ROWS = 8, COLS = 12;

export default function EventDetail({ params }: { params: { id: string } }) {
  const ev = EVENTS.find(x=>x.id===params.id);
  const router = useRouter();
  if(!ev){
    return (
      <div className="section">
        <div className="card" style={{padding:16}}>
          <div className="h1">Esemény nem található</div>
          <Link href="/events" className="btn" style={{marginTop:8}}>← Vissza az eseményekhez</Link>
        </div>
      </div>
    );
  }

  const occupied = new Set(["A1","A2","C5","D7","F6","H12"]);

  return <SeatPicker ev={ev} occupied={occupied} onPaid={()=>router.push("/tickets/my")} />;
}

function SeatPicker({ ev, occupied, onPaid }:{
  ev: {id:string; title:string; date:string; venue:string; price:number};
  occupied: Set<string>;
  onPaid: ()=>void;
}){
  const sel = new Set<string>();
  const toggle = (id:string)=>{
    if(occupied.has(id)) return;
    // naive toggle in DOM dataset for simplicity (no external state lib)
    const el = document.getElementById(id);
    if(!el) return;
    const on = el.dataset.on === "1";
    el.dataset.on = on? "0":"1";
    if(on) sel.delete(id); else sel.add(id);
    const total = (document.getElementById("total") as HTMLSpanElement);
    if(total) total.textContent = (sel.size * ev.price).toLocaleString("hu-HU");
  };

  const seats: React.ReactNode[] = [];
  for(let r=0;r<ROWS;r++){
    const row = String.fromCharCode(65+r); // A..H
    for(let c=1;c<=COLS;c++){
      const id = `${row}${c}`;
      const isOcc = occupied.has(id);
      seats.push(
        <button
          id={id}
          key={id}
          data-on="0"
          disabled={isOcc}
          onClick={()=>toggle(id)}
          className="btn"
          style={{
            width:32,height:32, padding:0, fontSize:12, borderRadius:8,
            background:isOcc?"#e5e7eb":"#fff"
          }}
          title={id}
        >{c}</button>
      );
    }
  }

  const pay = ()=>{
    const picked = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-on='1']")).map(b=>b.id);
    if(!picked.length) return;
    const key="kaposvar_tickets";
    const old = JSON.parse(localStorage.getItem(key) || "[]");
    old.push({ id: ev.id, title: ev.title, date: ev.date, venue: ev.venue, seats: picked, price: ev.price });
    localStorage.setItem(key, JSON.stringify(old));
    onPaid();
  };

  return (
    <div className="section">
      <div className="card" style={{padding:16}}>
        <div className="h1">{ev.title}</div>
        <div className="small">📅 {ev.date}</div>
        <div className="small">📍 {ev.venue}</div>
      </div>

      <div className="card" style={{padding:12, marginTop:12}}>
        <div className="small" style={{marginBottom:8}}>Ülésrend (kattints a székekre)</div>
        <div style={{display:"grid", gridTemplateColumns:`repeat(${COLS}, 32px)`, gap:6, justifyContent:"center"}}>
          {seats}
        </div>
      </div>

      <div className="card" style={{padding:12, marginTop:12}}>
        <div className="small">Összeg</div>
        <div style={{fontWeight:900, fontSize:18, marginBottom:8}}><span id="total">0</span> Ft</div>
        <button className="btn btn-primary" onClick={pay}>Fizetés (demó)</button>
      </div>
    </div>
  );
}
