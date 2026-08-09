import { Prompt, Sarabun } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { UserDataProvider } from "@/components/UserDataProvider";

const display = Prompt({
  subsets: ["thai", "latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Grandfather's Ultimate Ultra SuperNova",
  description:
    "แอปออกกำลังกายเบา ๆ ด้วยกล้อง สำหรับสุขภาพกายและใจของผู้สูงวัย",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${display.variable} ${body.variable}`}>
      <body>
        <AuthProvider>
          <UserDataProvider>{children}</UserDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
