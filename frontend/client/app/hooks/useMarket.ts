import { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../context/appContext";
import { Market, DummyMarketType, MarketChoiceData, MarketChoices, CairoOption } from "../types";

type PredictionCategory = "crypto" | "sports" | "all";

interface UseMarketDataParams {
  category?: PredictionCategory;
}

type CategoryCount = Record<string, number>;

interface UseMarketDataReturn {
  predictions: Market[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  category: PredictionCategory;
  counts: CategoryCount;
}

export const useMarketDataDummy = (params: UseMarketDataParams = {}): UseMarketDataReturn => {
  const { category = "all" } = params;
  const { searchQuery } = useAppContext();

  const [predictions, setPredictions] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<CategoryCount>({
    general: 0,
    crypto: 0,
    sports: 0,
    all: 0,
  });

  const fetchCounts = (markets: Market[]) => {
    const crypto = markets.filter((m) => m.title.toLowerCase().includes("crypto")).length;
    const sports = markets.filter((m) => m.title.toLowerCase().includes("sports")).length;
    const all = markets.length;
    const general = Math.max(0, all - crypto - sports);
    setCounts({ general, crypto, sports, all });
  };

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/dummy_data");
      if (!res.ok) throw new Error("Failed to fetch dummy markets");

      const data: DummyMarketType[] = await res.json();

  const mapped: Market[] = data.map((m) => {
  const optionOneStaked = BigInt(m.options[0]?.odds || 0);
  const optionTwoStaked = BigInt(m.options[1]?.odds || 0);

  const choices: MarketChoices = {
    0: { label: m.options[0]?.name || "No", staked_amount: optionOneStaked },
    1: { label: m.options[1]?.name || "Yes", staked_amount: optionTwoStaked },
  };

  return {
    market_id: BigInt(m.id),
    category: BigInt(0), 
    title: m.name,
    description: "",
    image_url: m.image,
    end_time: BigInt(m.endTime),
    is_open: m.status === "active",
    is_resolved: m.status !== "active",
    choices,
    total_pool: BigInt(parseInt(m.totalRevenue.replace(/[^0-9]/g, "")) || 0),
    total_shares_option_one: optionOneStaked,
    total_shares_option_two: optionTwoStaked,
    winning_choice: {} as CairoOption<number>,
  };
});


      // Apply category filter
      const filtered = category === "all"
        ? mapped
        : mapped.filter((m) => {
            if (category === "crypto") return m.title.toLowerCase().includes("crypto");
            if (category === "sports") return m.title.toLowerCase().includes("sports");
            return true;
          });

      // Apply search query filter
      const searchFiltered = searchQuery
        ? filtered.filter(
            (m) =>
              m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              Object.values(m.choices).some((o) =>
                o.label.toString().toLowerCase().includes(searchQuery.toLowerCase())
              )
          )
        : filtered;

      setPredictions(searchFiltered);
      fetchCounts(searchFiltered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch markets");
      setPredictions([]);
      setCounts({ general: 0, crypto: 0, sports: 0, all: 0 });
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  return {
    predictions,
    loading,
    error,
    refetch: fetchPredictions,
    category,
    counts,
  };
};
