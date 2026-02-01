"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/map", label: "Térkép", icon: "🗺" },
  { href: "/card", label: "Kártya", icon: "💳" },
  { href: "/events", label: "Események", icon: "🎟" },
  { href: "/parking", label: "Parkolás", icon: "🅿️" },
  { href: "/inspector", label: "Ellenőr", icon: "🔎" },
];

export default function BottomNavMobile() {
  const path = usePathname();

  return (
    <nav className="bottomnav">
      {TABS.map((t) => {
        const active = path?.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`tab ${active ? "active" : ""}`}
            aria-label={t.label}
            title={t.label}
          >
            <div style={{ fontSize: "1rem" }}>{t.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 800 }}>{t.label}</div>
          </Link>
        );
      })}
      <Link
        href="/admin"
        className="tab"
        aria-label="Admin"
        title="Admin"
      >
        <div style={{ fontSize: "1rem" }}>⋮</div>
        <div style={{ fontSize: 10, fontWeight: 800 }}>Admin</div>
      </Link>
    </nav>
  );
}
