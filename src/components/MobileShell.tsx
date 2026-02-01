"use client";
import BottomNavMobile from "./BottomNavMobile";

export default function MobileShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="stage">
      <div className="phone">
        <div className="phone-inner">
          <div className="phone-scroll">{children}</div>
          <BottomNavMobile />
        </div>
      </div>
    </div>
  );
}
