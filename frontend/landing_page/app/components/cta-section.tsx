"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronRight, ExternalLink } from "lucide-react";

export function CtaSection() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 to-blue-500 dark:from-emerald-900 dark:to-blue-900 p-8 md:p-12 animate-on-scroll shadow-xl">
        {/* Decorative floating elements */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl animate-pulse-slower"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:gap-8">
          {/* Text content */}
          <div className="md:w-2/3 text-center md:text-left">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl text-white">
              Ready to Start Forecasting?
            </h2>
            <p className="mb-6 max-w-2xl text-white/80">
              Join insightcast and be among the first to predict real-world
              events in a decentralized, transparent marketplace. Create
              markets, trade outcomes, and earn rewards from your insights.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 min-w-fit group"
                asChild
              >
                <Link
                  href="https://insightcast.app"
                  className="inline-flex items-center justify-center gap-2"
                >
                  Launch App
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 min-w-fit group"
                asChild
              >
              </Button>
            </div>
          </div>

          {/* Visual / Illustration */}
          <div className="mt-8 md:mt-0 md:w-1/3 flex justify-center">
            <div className="relative h-44 w-44 md:h-52 md:w-52 animate-float-slow">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/30 to-blue-400/30 blur-xl"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"></div>
              <div className="absolute inset-8 flex items-center justify-center rounded-full bg-white text-4xl font-bold text-slate-900">
                IC
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
