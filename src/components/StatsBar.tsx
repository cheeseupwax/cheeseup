import { Zap, Flame, BarChart3, Loader2 } from "lucide-react";
import { ContractStats } from "@/hooks/useContractStats";

interface StatsBarProps {
  stats: ContractStats | null;
  isLoading: boolean;
}

export const StatsBar = ({ stats, isLoading }: StatsBarProps) => {
  const fmt = (num: number, decimals = 2) =>
    num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const statItems = [
    {
      label: "Total Powerups",
      value: isLoading ? null : (stats?.totalPowerups.toLocaleString() ?? "0"),
      icon: Zap,
      iconClass: "text-cheese",
    },
    {
      label: "WAX Burnt",
      value: isLoading ? null : (stats ? `${fmt(stats.waxBurnt, 4)} WAX` : "0.0000 WAX"),
      icon: Flame,
      iconClass: "text-cheese-light",
    },
    {
      label: "CHEESE Nulled",
      value: isLoading ? null : (stats ? `${fmt(stats.cheeseNulled, 4)} CHEESE` : "0.0000 CHEESE"),
      icon: BarChart3,
      iconClass: "text-accent",
    },
  ];

  return (
    <div className="glass-card max-w-2xl w-full">
      <div className="grid grid-cols-3 divide-x divide-border">
        {statItems.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center justify-center gap-1.5 py-5 px-4 ${i === 1 ? "glass-card-hover" : ""}`}
          >
            <div className="flex items-center gap-2">
              <stat.icon className={`w-4 h-4 ${stat.iconClass}`} />
              {stat.value === null ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                <span className="text-sm font-bold font-mono text-foreground">{stat.value}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
