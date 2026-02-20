import { useState, useEffect } from "react";
import { Session } from "@wharfkit/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Zap, Cpu, Wifi, Loader2, CheckCircle, User, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useCheeseEstimate } from "@/hooks/useCheeseEstimate";

interface SuccessDetails {
  cpuMs: number;
  netBytes: number;
  totalCheese: number;
  recipient: string;
}

interface PowerUpCardProps {
  walletConnected: boolean;
  onConnectWallet: () => void;
  session: Session | null;
  accountName: string | null;
  cheeseBalance: number;
  onBalanceRefresh?: () => void;
  onStatsRefresh?: () => void;
}

const formatBytes = (bytes: number) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${bytes.toFixed(0)} bytes`;
};

const isValidWaxAccount = (account: string) => {
  if (!account || account.length === 0 || account.length > 12) return false;
  return /^[a-z1-5.]+$/.test(account);
};

export const PowerUpCard = ({
  walletConnected,
  onConnectWallet,
  session,
  accountName,
  cheeseBalance,
  onBalanceRefresh,
  onStatsRefresh,
}: PowerUpCardProps) => {
  const [cpuAmount, setCpuAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [recipient, setRecipient] = useState(accountName || "");
  const [isTransacting, setIsTransacting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successDetails, setSuccessDetails] = useState<SuccessDetails | null>(null);

  const totalCheese = cpuAmount + netAmount;
  

  const { estimate, isLoading: isEstimateLoading } = useCheeseEstimate(cpuAmount, netAmount);

  useEffect(() => {
    if (accountName) setRecipient(accountName);
  }, [accountName]);

  const handlePowerUp = async () => {
    if (!walletConnected) {
      onConnectWallet();
      return;
    }
    if (!session) {
      toast.error("Wallet session not found");
      return;
    }
    if (totalCheese <= 0) {
      toast.error("Please enter an amount of CHEESE for CPU or NET");
      return;
    }
    if (totalCheese > cheeseBalance) {
      toast.error("Insufficient CHEESE balance");
      return;
    }
    const targetRecipient = recipient || accountName;
    if (!targetRecipient || !isValidWaxAccount(targetRecipient)) {
      toast.error("Please enter a valid WAX account name");
      return;
    }

    setIsTransacting(true);
    try {
      let memo: string;
      if (cpuAmount > 0 && netAmount > 0) {
        const cpuPercent = Math.round((cpuAmount / totalCheese) * 100);
        const netPercent = 100 - cpuPercent;
        memo = `cpu:${cpuPercent},net:${netPercent}:${targetRecipient}`;
      } else if (netAmount > 0) {
        memo = `net:${targetRecipient}`;
      } else {
        memo = targetRecipient;
      }

      const action = {
        account: "cheeseburger",
        name: "transfer",
        authorization: [session.permissionLevel],
        data: {
          from: String(session.actor),
          to: "cheesepowerz",
          quantity: `${totalCheese.toFixed(4)} CHEESE`,
          memo,
        },
      };

      await session.transact({ actions: [action] });

      setSuccessDetails({
        cpuMs: estimate?.estimatedCpuMs || 0,
        netBytes: estimate?.estimatedNetBytes || 0,
        totalCheese,
        recipient: targetRecipient,
      });
      setShowSuccessDialog(true);
      onBalanceRefresh?.();
      onStatsRefresh?.();
      setCpuAmount(0);
      setNetAmount(0);
    } catch (error) {
      console.error("Transaction failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Transaction failed";
      const isCpuError =
        errorMessage.toLowerCase().includes("cpu") ||
        errorMessage.toLowerCase().includes("billed") ||
        errorMessage.toLowerCase().includes("deadline");

      if (isCpuError) {
        toast.error("Transaction failed — insufficient resources", {
          description:
            "Anchor users: enable Greymass Fuel. WAX Cloud Wallet users should have free CPU automatically.",
          duration: 8000,
        });
      } else {
        toast.error("PowerUp failed", { description: errorMessage });
      }
    } finally {
      setIsTransacting(false);
    }
  };

  const canPowerUp =
    walletConnected &&
    totalCheese > 0 &&
    totalCheese <= cheeseBalance &&
    isValidWaxAccount(recipient || accountName || "");

  return (
    <>
      <div className="glass-card p-6 space-y-6 max-w-lg w-full animate-pulse-cheese" style={{ animationName: "none", border: "1px solid hsl(45 100% 50% / 0.2)" }}>
        {/* Card header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Power Up Resources</h2>
          <p className="text-sm text-muted-foreground">
            Spend CHEESE to rent CPU &amp; NET on WAX
          </p>
        </div>

        {/* Recipient */}
        <div className="space-y-2">
          <Label className="text-muted-foreground flex items-center gap-2">
            <User className="w-4 h-4" />
            Recipient Account
          </Label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value.toLowerCase())}
            placeholder="waxaccount.wam"
            disabled={isTransacting}
            className="bg-secondary border-border font-mono"
          />
          {recipient && !isValidWaxAccount(recipient) && (
            <p className="text-xs text-destructive">Invalid WAX account name</p>
          )}
        </div>

        {/* CPU Input */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-muted-foreground">
            <Cpu className="w-4 h-4 text-cheese" />
            CPU Power
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={cpuAmount || ""}
              onChange={(e) => setCpuAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="flex-1 bg-secondary border-border font-mono"
              placeholder="0"
              disabled={isTransacting}
            />
            <span className="text-sm text-muted-foreground font-mono">CHEESE</span>
          </div>
          {estimate && cpuAmount > 0 && (
            <p className="text-xs text-muted-foreground">
              ≈ {estimate.estimatedCpuMs.toFixed(0)}ms CPU
              {isEstimateLoading && " (updating...)"}
            </p>
          )}
        </div>

        {/* NET Input */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-muted-foreground">
            <Wifi className="w-4 h-4 text-accent" />
            NET Bandwidth
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={netAmount || ""}
              onChange={(e) => setNetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="flex-1 bg-secondary border-border font-mono"
              placeholder="0"
              disabled={isTransacting}
            />
            <span className="text-sm text-muted-foreground font-mono">CHEESE</span>
          </div>
          {estimate && netAmount > 0 && (
            <p className="text-xs text-muted-foreground">
              ≈ {formatBytes(estimate.estimatedNetBytes)} NET
              {isEstimateLoading && " (updating...)"}
            </p>
          )}
        </div>

        {/* Cost summary */}
        {totalCheese > 0 && (
          <div className="rounded-lg bg-secondary border border-border p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total cost</span>
              <span className="font-mono font-bold text-cheese">
                {totalCheese.toLocaleString(undefined, { maximumFractionDigits: 4 })} CHEESE
              </span>
            </div>
            {walletConnected && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Balance after</span>
                <span className={`font-mono ${totalCheese > cheeseBalance ? "text-destructive" : "text-muted-foreground"}`}>
                  {Math.max(0, cheeseBalance - totalCheese).toLocaleString(undefined, { maximumFractionDigits: 4 })} CHEESE
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action button */}
        <button
          onClick={handlePowerUp}
          disabled={(walletConnected && !canPowerUp) || isTransacting}
          className={`
            w-full h-12 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-all duration-200
            ${!walletConnected
              ? "bg-cheese-gradient text-primary-foreground cheese-glow hover:cheese-glow-intense"
              : canPowerUp
              ? "bg-cheese-gradient text-primary-foreground cheese-glow hover:cheese-glow-intense"
              : "bg-secondary text-muted-foreground cursor-not-allowed opacity-60"}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isTransacting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : !walletConnected ? (
            <>
              <Zap className="w-5 h-5" />
              Connect Wallet to Power Up
            </>
          ) : canPowerUp ? (
            <>
              <Zap className="w-5 h-5" />
              POWER UP
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Enter Amount
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Resources rented for 24 hours from the WAX PowerUp pool
        </p>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="glass-card border-cheese/30 max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <CheckCircle className="w-6 h-6 text-green-400" />
              PowerUp Successful! 🧀
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-muted-foreground text-sm">
              Resources powered up for{" "}
              <span className="font-mono font-semibold text-foreground">{successDetails?.recipient}</span>
            </p>
            <div className="space-y-2">
              {successDetails && successDetails.cpuMs > 0 && (
                <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
                  <Cpu className="w-4 h-4 text-cheese flex-shrink-0" />
                  <span className="text-sm text-foreground">~{successDetails.cpuMs.toFixed(0)}ms CPU (estimate)</span>
                </div>
              )}
              {successDetails && successDetails.netBytes > 0 && (
                <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
                  <Wifi className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="text-sm text-foreground">~{formatBytes(successDetails.netBytes)} NET (estimate)</span>
                </div>
              )}
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center">
              <span className="text-sm text-muted-foreground">CHEESE spent: </span>
              <span className="font-mono font-bold text-cheese">
                {successDetails?.totalCheese.toFixed(4)} CHEESE
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Actual resources may vary based on network conditions.
            </p>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full h-10 rounded-lg bg-cheese-gradient text-primary-foreground font-bold cheese-glow"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
