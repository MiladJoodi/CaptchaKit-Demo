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
    "Interactive demo for CaptchaKit by Milad Joodi — try every CAPTCHA type, locale, difficulty, and theme.",
  authors: [{ name: "Milad Joodi", url: "https://www.linkedin.com/in/joodi/" }],
  openGraph: {
    title: "CaptchaKit Playground",
    description:
      "Self-hosted CAPTCHA for React and Next.js. Try it live, then install from npm.",
    url: "https://captchakit.netlify.app/",
  },
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
