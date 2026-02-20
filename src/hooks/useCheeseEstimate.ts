import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export interface PowerUpEstimate {
  cheesePriceInWax: number;
  cheeseUsdPrice: number;
  waxUsdPrice: number;
  cpuWaxAmount: number;
  netWaxAmount: number;
  estimatedCpuMs: number;
  estimatedNetBytes: number;
}

interface UseCheeseEstimateResult {
  estimate: PowerUpEstimate | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const WAX_ENDPOINTS = [
  "https://wax.eosusa.io",
  "https://api.waxsweden.org",
  "https://wax.greymass.com",
];

// Fetch WAX PowerUp state from chain
const fetchPowerUpState = async (): Promise<{ cpuWeight: number; netWeight: number; totalCpuWeight: number; totalNetWeight: number } | null> => {
  for (const base of WAX_ENDPOINTS) {
    try {
      const res = await fetch(`${base}/v1/chain/get_table_rows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: "eosio",
          scope: "0",
          table: "powup.state",
          json: true,
          limit: 1,
        }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (data.rows && data.rows.length > 0) {
        const row = data.rows[0];
        return {
          cpuWeight: row.cpu.weight || 0,
          netWeight: row.net.weight || 0,
          totalCpuWeight: row.cpu.weight_ratio ? Number(row.cpu.weight_ratio) : 1000000000000000,
          totalNetWeight: row.net.weight_ratio ? Number(row.net.weight_ratio) : 1000000000000000,
        };
      }
    } catch { continue; }
  }
  return null;
};

export const useCheeseEstimate = (
  cpuCheeseAmount: number,
  netCheeseAmount: number
): UseCheeseEstimateResult => {
  const [estimate, setEstimate] = useState<PowerUpEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedCpu = useDebounce(cpuCheeseAmount, 500);
  const debouncedNet = useDebounce(netCheeseAmount, 500);

  const fetchEstimate = useCallback(async () => {
    if (debouncedCpu <= 0 && debouncedNet <= 0) {
      setEstimate(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch CHEESE price from Alcor DEX
      let cheesePriceInWax = 0.001; // fallback
      try {
        const alcorRes = await fetch("https://wax.alcor.exchange/api/markets/748");
        if (alcorRes.ok) {
          const alcorData = await alcorRes.json();
          cheesePriceInWax = alcorData.last_price || cheesePriceInWax;
        }
      } catch { /* use fallback */ }

      // Estimate WAX amounts from CHEESE
      const cpuWaxAmount = debouncedCpu * cheesePriceInWax;
      const netWaxAmount = debouncedNet * cheesePriceInWax;

      // Rough CPU/NET estimation (based on typical WAX network ratios)
      // ~1 WAX ≈ 5000ms CPU, 1 WAX ≈ 500KB NET (rough estimates)
      const estimatedCpuMs = cpuWaxAmount * 5000;
      const estimatedNetBytes = netWaxAmount * 500 * 1024;

      setEstimate({
        cheesePriceInWax,
        cheeseUsdPrice: 0,
        waxUsdPrice: 0,
        cpuWaxAmount,
        netWaxAmount,
        estimatedCpuMs,
        estimatedNetBytes,
      });
    } catch (err) {
      console.error("Failed to fetch estimate:", err);
      setError("Could not fetch price estimate");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedCpu, debouncedNet]);

  useEffect(() => {
    fetchEstimate();
  }, [fetchEstimate]);

  return { estimate, isLoading, error, refetch: fetchEstimate };
};
