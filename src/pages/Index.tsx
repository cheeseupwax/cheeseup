import { useWaxWallet } from "@/hooks/useWaxWallet";
import { useContractStats } from "@/hooks/useContractStats";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { PowerUpCard } from "@/components/PowerUpCard";
import { StatsBar } from "@/components/StatsBar";
import { Footer } from "@/components/Footer";

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

      <Header
        walletConnected={isConnected}
        walletAddress={accountName || undefined}
        cheeseBalance={cheeseBalance}
        isLoadingBalance={isLoadingBalance}
        onConnectWallet={handleConnectWallet}
        isLoading={isLoading}
      />

      <main className="relative z-10 flex flex-col items-center min-h-screen px-4 pt-28 pb-4 gap-6">
        {/* Hero */}
        <div className="text-center space-y-3 mt-4 mb-2">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{ background: "hsl(45 100% 50% / 0.3)", transform: "scale(1.5)" }}
              />
              <span className="relative text-6xl md:text-7xl select-none">🧀</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="text-cheese-gradient">Cheese</span>
            <span className="text-foreground">Up</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            Fuel your WAX transactions with <span className="text-cheese font-semibold">CHEESE</span>.
            Rent CPU &amp; NET instantly from the PowerUp pool.
          </p>
        </div>

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
