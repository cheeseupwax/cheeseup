import { Button } from "@/components/ui/button";
import { Wallet, Loader2, LogOut, Coins } from "lucide-react";

interface HeaderProps {
  walletConnected: boolean;
  walletAddress?: string;
  cheeseBalance?: number;
  isLoadingBalance?: boolean;
  onConnectWallet: () => void;
  isLoading?: boolean;
}

export const Header = ({
  walletConnected,
  walletAddress,
  cheeseBalance = 0,
  isLoadingBalance,
  onConnectWallet,
  isLoading,
}: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div
        className="max-w-5xl mx-auto flex items-center justify-between glass-card px-5 py-3"
        style={{ borderColor: "hsl(45 100% 50% / 0.2)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-cheese-gradient opacity-20 animate-pulse-cheese" />
            <span className="relative text-xl">🧀</span>
          </div>
          <div>
            <span className="text-xl font-extrabold text-cheese-gradient">CheeseUp</span>
            <p className="text-xs text-muted-foreground leading-none mt-0.5">WAX Resource Station</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {walletConnected && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border text-sm">
              <Coins className="w-4 h-4 text-cheese" />
              {isLoadingBalance ? (
                <span className="text-muted-foreground text-xs">Loading...</span>
              ) : (
                <span className="font-mono font-semibold text-cheese">
                  {cheeseBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} CHEESE
                </span>
              )}
            </div>
          )}

          <Button
            onClick={onConnectWallet}
            disabled={isLoading}
            className={
              walletConnected
                ? "border border-border bg-secondary hover:bg-muted text-foreground gap-2"
                : "bg-cheese-gradient text-primary-foreground font-bold gap-2 cheese-glow hover:cheese-glow-intense transition-all"
            }
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : walletConnected ? (
              <LogOut className="w-4 h-4" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            {isLoading
              ? "Loading..."
              : walletConnected
              ? <span className="font-mono text-sm">{walletAddress}</span>
              : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </header>
  );
};
