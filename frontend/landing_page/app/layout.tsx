import type { Metadata } from "next";
import "./globals.css";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "./contexts/ThemeContext";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
export const metadata: Metadata = {
  title: "insightcast",
  description:
    "insightcast introduces a transparent, decentralized forecasting marketplace transforms real-world events into tradable prediction markets.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body className={`${manrope.className}  antialiased `}>{children}</body>
      </ThemeProvider>
    </html>
  );
}
