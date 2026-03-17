import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PSL Analyzer",
  description: "Precision facial analysis for the digitally inclined",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Brainletcoin.fun fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Comic+Neue:wght@700&family=Gochi+Hand&family=Bangers&family=Fira+Code:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-brainlet-white text-brainlet-black relative">
        {/* Video background */}
        <video
          className="brainlet-video-bg"
          autoPlay
          muted
          playsInline
          loop
          src="/grok-video-90b41809-a285-4750-9a7c-db2d518d6020.mp4"
        />
        {children}
      </body>
    </html>
  );
}
