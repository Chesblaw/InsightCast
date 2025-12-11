import { BarChart2, Shield, Globe2, Zap, Users, Award } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <BarChart2 className="h-6 w-6" />,
      title: "Predict & Earn",
      description:
        "Stake tokens on multi-outcome markets. Accurate predictions are rewarded proportionally, incentivizing insight and skill.",
    },
    {
      icon: <Globe2 className="h-6 w-6" />,
      title: "Decentralized & Transparent",
      description:
        "All markets are fully on-chain and verifiable. No central authority, no manipulation — every transaction is secure and transparent.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Smart Contracts",
      description:
        "All funds are locked in audited smart contracts. Liquidity provision, trades, and payouts are handled automatically and securely.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Automated Market Making",
      description:
        "Markets use a custom AMM bonding curve for dynamic share pricing. Liquidity is efficiently allocated, ensuring fair and accurate odds.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Governance",
      description:
        "Disputes, oracle failures, and new market categories are resolved via DAO voting. Your voice shapes the insightcast ecosystem.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Reputation & Rewards",
      description:
        "Earn reputation points and badges for accurate predictions. Unlock higher market limits, governance influence, and referral rewards.",
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="mb-16 text-center animate-on-scroll">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose insightcast</h2>
        <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-300">
          Decentralized forecasting with real-time data, community governance, and rewards for insight.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 p-6 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1 animate-on-scroll"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500/5 to-blue-500/5 blur-2xl transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-emerald-500/10 group-hover:to-blue-500/10 dark:from-emerald-500/20 dark:to-blue-500/20 dark:group-hover:from-emerald-500/30 dark:group-hover:to-blue-500/30"></div>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 dark:from-emerald-500/20 dark:to-blue-500/20 transition-transform duration-300 group-hover:scale-110">
              {feature.icon}
            </div>

            <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
