"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } =
        heroRef.current.getBoundingClientRect();

      const x = (clientX - left) / width;
      const y = (clientY - top) / height;

      const moveX = 20 * (x - 0.5);
      const moveY = 20 * (y - 0.5);

      const gradientElements =
        heroRef.current.querySelectorAll(".hero-gradient");
      gradientElements.forEach((el) => {
        (el as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="container mx-auto px-4 py-20 md:py-32 relative overflow-hidden"
    >
      {/* BG gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hero-gradient absolute top-1/4 -right-20 h-64 w-64 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl transition-transform duration-300 ease-out"></div>
        <div className="hero-gradient absolute bottom-1/4 -left-20 h-64 w-64 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl transition-transform duration-300 ease-out"></div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center text-center relative z-10 animate-fade-in">
        <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-5xl text-slate-900 dark:text-white">
          The Intelligent Way to{" "}
            Predict the Future
        </h1>

        <p className="mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-300 md:text-xl">
          Create markets, forecast outcomes, and earn rewards powered by
          decentralized insight trading. Discover the next generation of
          prediction markets.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white border-0 shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105"
            asChild
          >
            <Link
              href="https://insightcast.app"
              className="inline-flex items-center gap-2"
            >
              Launch App
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Floating blobs */}
        <div className="absolute top-1/4 right-10 h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hidden lg:block animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-10 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 hidden lg:block animate-float"></div>
      </div>
    </section>
  );
}
