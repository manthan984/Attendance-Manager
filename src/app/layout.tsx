import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Attendance Manager — Track Your Class Attendance",
  description:
    "A beautiful, modern attendance tracking application. Monitor your class attendance across all subjects, set danger thresholds, and never miss a class again.",
  keywords: ["attendance", "tracker", "student", "university", "classes"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body> 
    </html>
  );
}
