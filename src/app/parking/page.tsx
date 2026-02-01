"use client";
import { useEffect, useMemo, useState } from "react";
import * as parkingStore from "@/lib/parkingStore";
import type { ParkingSession } from "@/lib/parkingStore";

const PLATE_REGEX = /^([A-Z]{3}-\d{3}|[A-Z]{3}\d{3})$/;

export default function ParkingPage() {
  const [plate, setPlate] = useState("");
  const [zone, setZone] = useState<"Z1" | "Z2" | "Z3" | "">("");
  const [tick, setTick] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  const active = useMemo(() => parkingStore.getActive(), [tick]);
  const isValidPlate = plate.length > 0 && PLATE_REGEX.test(plate);
  const canStart = isValidPlate && zone !== "";

  // Timer effect
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleStart = () => {
    if (!canStart) return;
    parkingStore.start(plate, zone as "Z1" | "Z2" | "Z3", 60);
    setTick((t) => t + 1);
  };

  const handleStop = () => {
    parkingStore.stop();
    setTick((t) => t + 1);
  };

  if (!isHydrated) {
    return (
      <div className="section">
        <div className="h1">Parkolás</div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="h1">Parkolás</div>
      <p className="small">Demó – önkormányzati rendszerhez nincs kapcsolva.</p>

      {!active ? (
        <StartForm
          plate={plate}
          setPlate={setPlate}
          zone={zone}
          setZone={setZone}
          onStart={handleStart}
          isValidPlate={isValidPlate}
          canStart={canStart}
        />
      ) : (
        <ActiveCard session={active} tick={tick} onStop={handleStop} />
      )}
    </div>
  );
}

function StartForm({
  plate,
  setPlate,
  zone,
  setZone,
  onStart,
  isValidPlate,
  canStart,
}: {
  plate: string;
  setPlate: (p: string) => void;
  zone: string;
  setZone: (z: "Z1" | "Z2" | "Z3") => void;
  onStart: () => void;
  isValidPlate: boolean;
  canStart: boolean;
}) {
  return (
    <div className="card" style={{ padding: 16, marginTop: 12 }}>
      <div className="field">
        <label className="small">Rendszám</label>
        <input
          type="text"
          value={plate}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
          className="field__input"
          placeholder="ABC-123 vagy ABC123"
          style={{
            borderColor: plate.length > 0 && !isValidPlate ? "#ef4444" : "#e2e8f0",
          }}
        />
        {plate.length > 0 && !isValidPlate && (
          <div className="small" style={{ color: "#ef4444", marginTop: 4 }}>
            Formátum: ABC-123 vagy ABC123
          </div>
        )}
      </div>

      <div className="small" style={{ marginTop: 12, marginBottom: 8 }}>
        Zóna
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(["Z1", "Z2", "Z3"] as const).map((z) => (
          <button
            key={z}
            onClick={() => setZone(z)}
            className={`btn ${zone === z ? "btn-primary" : ""}`}
          >
            {z} · {parkingStore.ZONES[z].hourly} Ft/óra
          </button>
        ))}
      </div>

      <button
        onClick={onStart}
        className="btn btn-primary"
        style={{ width: "100%", marginTop: 12 }}
        disabled={!canStart}
      >
        PARKOLÁS INDÍTÁSA
      </button>
    </div>
  );
}

function ActiveCard({
  session,
  tick,
  onStop,
}: {
  session: ParkingSession;
  tick: number;
  onStop: () => void;
}) {
  const t = parkingStore.totals(session);

  return (
    <div className="card" style={{ padding: 16, marginTop: 12 }}>
      <div className="small">Aktív parkolás</div>
      <div style={{ fontWeight: 900, marginTop: 4, fontSize: 16 }}>
        {session.plate} · {session.zone}
      </div>

      <div className="small" style={{ marginTop: 12, marginBottom: 4 }}>
        Idő
      </div>
      <div style={{ fontWeight: 900, fontSize: 24, color: "#1e66f5" }}>
        {t.mmss}
      </div>

      <div className="small" style={{ marginTop: 12, marginBottom: 4 }}>
        Díj
      </div>
      <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 4 }}>
        {t.totalFt.toLocaleString("hu-HU")} Ft
      </div>
      <div className="small" style={{ opacity: 0.7, lineHeight: 1.5 }}>
        (ebből ~{session.convenienceFt} Ft rendszerhasználati díj)
      </div>

      <button
        onClick={onStop}
        className="btn btn-primary"
        style={{ width: "100%", marginTop: 12 }}
      >
        Leállítás
      </button>
    </div>
  );
}
