import { useWaxWallet } from "@/hooks/useWaxWallet";
import { useContractStats } from "@/hooks/useContractStats";
import { toast } from "sonner";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { PowerUpCard } from "@/components/PowerUpCard";
import { StatsBar } from "@/components/StatsBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Loader2 } from "lucide-react";

const Index = () => {
  const {
    isConnected,
    accountName,
    isLoading,
    session,
    cheeseBalance,
    isLoadingBalance,
    connect,
    disconnect,
    refreshBalance,
  } = useWaxWallet();

  const { stats, isLoading: statsLoading, refetch: refetchStats } = useContractStats();

  const handleConnectWallet = async () => {
    if (isConnected) {
      await disconnect();
      toast.info("Wallet disconnected");
    } else {
      try {
        await connect();
        toast.success("Wallet connected!");
      } catch {
        toast.error("Failed to connect wallet");
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundEffects />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 gap-6">

        {/* Wallet button — centred above title */}
        <div className="flex flex-col items-center gap-2">
          {isLoading ? (
            <Button variant="outline" disabled className="gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </Button>
          ) : isConnected && accountName ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                👤 {accountName}
              </span>
              <Button variant="outline" size="sm" onClick={handleConnectWallet} className="gap-2 border-border">
                <LogOut className="h-4 w-4" />
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={handleConnectWallet} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-cheese-gradient tracking-wider">
          CHEESE.Up
        </h1>

        {/* PowerUp Card */}
        <PowerUpCard
          walletConnected={isConnected}
          onConnectWallet={handleConnectWallet}
          session={session}
          accountName={accountName}
          cheeseBalance={cheeseBalance}
          onBalanceRefresh={refreshBalance}
          onStatsRefresh={refetchStats}
        />

        {/* Stats Bar */}
        <StatsBar stats={stats} isLoading={statsLoading} />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
