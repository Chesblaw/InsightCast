"use client";

import { useEffect, useState } from "react";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "InsightCast has transformed how I forecast crypto markets. The transparency and community-driven approach is unparalleled.",
    name: "Alice Johnson",
    title: "Crypto Analyst",
  },
  {
    quote:
      "Creating prediction markets has never been easier. InsightCast makes forecasting rewarding and intuitive.",
    name: "Mark Thompson",
    title: "Market Maker",
  },
  {
    quote:
      "I love how the platform rewards accuracy. It's like a game, but with real impact and real rewards.",
    name: "Sophia Lee",
    title: "Trader",
  },
];

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="relative max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 md:text-4xl animate-on-scroll">
          What Our Users Say
        </h2>

        <div className="relative h-48 md:h-56 overflow-hidden">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full transition-all duration-1000 ease-in-out
                ${index === currentIndex ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"}
              `}
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 md:p-10 text-center">
                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 mb-4">
                  “{t.quote}”
                </p>
                <div className="text-sm md:text-base font-semibold text-slate-900 dark:text-white">
                  {t.name}
                </div>
                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                  {t.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`h-2 w-2 rounded-full transition-all duration-300
                ${idx === currentIndex ? "bg-emerald-500 dark:bg-emerald-400" : "bg-gray-300 dark:bg-slate-600"}
              `}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
