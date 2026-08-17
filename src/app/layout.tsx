import type { Metadata, Viewport } from "next";
import "./globals.css";
import AssistantWidget from "@/components/AssistantWidget";

// Les polices sont chargées via Google Fonts en <link> (et non next/font/google) :
// le bac à sable de génération n'a pas accès à fonts.googleapis.com au moment du
// build, mais le navigateur du citoyen y aura accès normalement en production.

export const metadata: Metadata = {
  title: "e-CIN Djibouti — Pré-demande de Carte d'Identité Nationale",
  description:
    "Préparez votre demande de Carte d'Identité Nationale depuis chez vous. Ne vous déplacez que lorsque votre présence physique est nécessaire.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0b3a52",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <AssistantWidget />
      </body>
    </html>
  );
}
