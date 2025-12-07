"use client";

import { Header } from "./components/header";
import { DashboardPreview } from "./components/dashboard-preview";
import { Hero } from "./components/hero";
import { HowItWorks } from "./components/how-it-works";
import { Features } from "./components/features";
import { CtaSection } from "./components/cta-section";
import { TestimonialSlider } from "./components/testimonial";
import { Footer } from "./components/footer";
import { useState, useEffect } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        {/* Animated background - visible only in dark mode */}
        <div className="absolute inset-0 overflow-hidden dark:block hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl animate-pulse-slower"></div>
          <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-3xl animate-pulse-slow"></div>
        </div>

        {/* Content */}
        <div className="relative">
          <Header />
           <main>
            <Hero />
            <DashboardPreview />
            <HowItWorks />
            <Features />
            <TestimonialSlider />
            <CtaSection />
            <Footer />
          </main>
        </div>
      </div>
  );
}
