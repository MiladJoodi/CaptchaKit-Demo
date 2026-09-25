import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Geist,
  Geist_Mono,
  Vazirmatn,
} from "next/font/google";
import "./globals.css";

const brand = Bricolage_Grotesque({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const fa = Vazirmatn({
  variable: "--font-fa",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CaptchaKit Playground",
  description:
    "Interactive demo for captchakit — try every CAPTCHA type, locale, difficulty, and theme, then copy the React snippet.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${brand.variable} ${sans.variable} ${mono.variable} ${fa.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
