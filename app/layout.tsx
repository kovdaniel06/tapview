import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Tapview - Szerezz több Google értékelést egyetlen érintéssel",
  description: "Segíts az elégedett ügyfeleknek azonnal Google értékelést hagyni prémium NFC kártyákkal és állványokkal.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-icon.png" },
    ],
  },
  openGraph: {
    title: "Tapview - NFC Google Értékelő Állványok",
    description: "Növeld a Google értékeléseid számát egyszerűen és gyorsan NFC technológiával.",
    url: "https://tapview.hu",
    siteName: "Tapview",
    locale: "hu_HU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="hu" data-scroll-behavior="smooth">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}