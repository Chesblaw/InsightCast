import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 py-12">
      <div className="container mx-auto px-4">
        {/* Top Section: Logo + Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center font-bold text-white text-lg">
                I
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                insightcast
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">
              Transparent, decentralized forecasting marketplace. Create markets, predict outcomes, and earn rewards with confidence.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="#features" className="hover:text-emerald-500 dark:hover:text-emerald-400">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-emerald-500 dark:hover:text-emerald-400">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="https://app.insightcast.com" className="flex items-center gap-1 hover:text-emerald-500 dark:hover:text-emerald-400">
                  App <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="#about" className="hover:text-emerald-500 dark:hover:text-emerald-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-emerald-500 dark:hover:text-emerald-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="#terms" className="hover:text-emerald-500 dark:hover:text-emerald-400">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="hover:text-emerald-500 dark:hover:text-emerald-400">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#cookies" className="hover:text-emerald-500 dark:hover:text-emerald-400">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright + Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {currentYear} insightcast. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="https://twitter.com/insightcast" className="text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.25c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Link>
            <Link href="https://github.com/Chesblaw/insightcast" className="text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
