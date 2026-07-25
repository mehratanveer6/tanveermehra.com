import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./theme.css";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { CustomCursor } from "@/components/site/cursor/CustomCursor";

export const metadata: Metadata = {
  title: "Tanveer Mehra — Work",
  description:
    "AI Product Engineer — projects, experience, and the rest of the story after the card.",
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${GeistSans.variable} ${GeistMono.variable} work-root font-display min-h-screen`}>
      <SmoothScroll>
        <CustomCursor />
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
      </SmoothScroll>
    </div>
  );
}
