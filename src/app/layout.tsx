import type { Metadata, Viewport } from "next";
import "./globals.css";
import MobileShell from "@/components/MobileShell";

export const metadata: Metadata = {
  title: "Kaposvár+",
  description: "Mobil demó",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#1e66f5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body>
        <MobileShell>{children}</MobileShell>
        <script
          dangerouslySetInnerHTML={{
            __html: `
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
}
`,
          }}
        />
      </body>
    </html>
  );
}
