import "./globals.css";
import { Kanit, Sarabun } from "next/font/google";
import Providers from "./providers";

// Sarabun: the readable, government-standard Thai body typeface.
// Kanit: a warm, rounded Thai display face for headings and the wordmark.
const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

export const metadata = {
  title: "Grand Father's Ultimate Ultra Supernova Webb",
  description: "แอปออกกำลังกายเบา ๆ ด้วยการเคลื่อนไหว เพื่อสุขภาพกายและใจของผู้สูงอายุ",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  // Never lock pinch-zoom — some elderly users rely on it even with an
  // in-app font-size setting.
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${kanit.variable} ${sarabun.variable}`}>
      <body className="min-h-screen bg-cream font-body text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
