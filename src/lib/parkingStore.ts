export interface ParkingSession {
  plate: string;
  zone: "Z1" | "Z2" | "Z3";
  startedAt: number;
  convenienceFt: number;
  stoppedAt?: number;
}

export const ZONES: Record<"Z1" | "Z2" | "Z3", { name: string; hourly: number }> = {
  Z1: { name: "Belváros", hourly: 400 },
  Z2: { name: "Piac", hourly: 300 },
  Z3: { name: "Park", hourly: 200 },
};

const LS_KEY = "kaposvar_parking_session";

export function start(
  plate: string,
  zone: "Z1" | "Z2" | "Z3",
  convenienceFt = 60
): ParkingSession {
  const session: ParkingSession = {
    plate,
    zone,
    startedAt: Date.now(),
    convenienceFt,
  };
  localStorage.setItem(LS_KEY, JSON.stringify(session));
  return session;
}

export function getActive(): ParkingSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as ParkingSession;
    if (!session.stoppedAt) return session;
  } catch {}
  return null;
}

export function stop(): ParkingSession | null {
  const session = getActive();
  if (!session) return null;
  session.stoppedAt = Date.now();
  localStorage.setItem(LS_KEY, JSON.stringify(session));
  return session;
}

export function clear(): void {
  localStorage.removeItem(LS_KEY);
}

export interface ParkingTotals {
  minutes: number;
  hours: number;
  feeFt: number;
  totalFt: number;
  mmss: string;
}

export function totals(
  session: ParkingSession,
  now = Date.now()
): ParkingTotals {
  const end = session.stoppedAt ?? now;
  const minutes = Math.max(1, Math.ceil((end - session.startedAt) / 60000));
  const hours = minutes / 60;
  const hourlyRate = ZONES[session.zone].hourly;
  const feeFt = Math.ceil(hours * hourlyRate);
  const totalFt = feeFt + session.convenienceFt;
  const mm = String(Math.floor(minutes / 60)).padStart(2, "0");
  const ss = String(minutes % 60).padStart(2, "0");
  const mmss = `${mm}:${ss}`;
  return { minutes, hours, feeFt, totalFt, mmss };
}

export default {
  start,
  getActive,
  stop,
  clear,
  totals,
  ZONES,
};
