import { useState, useEffect, useCallback } from "react";
import { Session, SessionKit } from "@wharfkit/session";
import { WalletPluginAnchor } from "@wharfkit/wallet-plugin-anchor";
import { WalletPluginCloudWallet } from "@wharfkit/wallet-plugin-cloudwallet";
import { WebRenderer } from "@wharfkit/web-renderer";

const WAX_CHAIN = {
  id: "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
  url: "https://wax.greymass.com",
};

let sessionKit: SessionKit | null = null;

const getSessionKit = () => {
  if (!sessionKit) {
    sessionKit = new SessionKit({
      appName: "CheeseUp",
      chains: [WAX_CHAIN],
      ui: new WebRenderer(),
      walletPlugins: [
        new WalletPluginAnchor(),
        new WalletPluginCloudWallet({
          supportedChains: [WAX_CHAIN.id],
          url: "https://www.mycloudwallet.com",
          autoUrl: "https://idm-api.mycloudwallet.com/v1/accounts/auto-accept",
          loginTimeout: 300000,
        }),
      ],
    });
  }
  return sessionKit;
};

export interface WaxWalletState {
  session: Session | null;
  isConnected: boolean;
  accountName: string | null;
  isLoading: boolean;
  error: string | null;
  cheeseBalance: number;
  isLoadingBalance: boolean;
}

const WAX_ENDPOINTS = [
  "https://wax.eosusa.io/v1/chain/get_table_rows",
  "https://api.waxsweden.org/v1/chain/get_table_rows",
  "https://wax.greymass.com/v1/chain/get_table_rows",
];

export const useWaxWallet = () => {
  const [state, setState] = useState<WaxWalletState>({
    session: null,
    isConnected: false,
    accountName: null,
    isLoading: true,
    error: null,
    cheeseBalance: 0,
    isLoadingBalance: false,
  });

  const fetchCheeseBalance = useCallback(async (accountName: string) => {
    setState((prev) => ({ ...prev, isLoadingBalance: true }));

    for (const endpoint of WAX_ENDPOINTS) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: "cheeseburger",
            scope: accountName,
            table: "accounts",
            json: true,
            limit: 1,
          }),
        });

        if (!response.ok) continue;

        const data = await response.json();

        if (data.rows && data.rows.length > 0) {
          const balanceStr = data.rows[0].balance;
          const balance = parseFloat(balanceStr.split(" ")[0]);
          setState((prev) => ({ ...prev, cheeseBalance: balance, isLoadingBalance: false }));
          return;
        } else {
          setState((prev) => ({ ...prev, cheeseBalance: 0, isLoadingBalance: false }));
          return;
        }
      } catch (error) {
        console.error(`Failed to fetch balance from ${endpoint}:`, error);
        continue;
      }
    }
    setState((prev) => ({ ...prev, isLoadingBalance: false }));
  }, []);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const kit = getSessionKit();
        const restored = await kit.restore();
        if (restored) {
          const name = String(restored.actor);
          setState({
            session: restored,
            isConnected: true,
            accountName: name,
            isLoading: false,
            error: null,
            cheeseBalance: 0,
            isLoadingBalance: true,
          });
          fetchCheeseBalance(name);
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };
    restoreSession();
  }, [fetchCheeseBalance]);

  const connect = useCallback(async () => {
    // Don't set isLoading here — the wallet SDK shows its own UI overlay.
    // Setting isLoading causes a permanent spinner if the user closes the popup
    // because kit.login() never resolves/rejects in that case.
    setState((prev) => ({ ...prev, error: null }));
    try {
      const kit = getSessionKit();
      const response = await kit.login();
      if (response.session) {
        const name = String(response.session.actor);
        setState({
          session: response.session,
          isConnected: true,
          accountName: name,
          isLoading: false,
          error: null,
          cheeseBalance: 0,
          isLoadingBalance: true,
        });
        fetchCheeseBalance(name);
        return response.session;
      }
    } catch (error) {
      console.warn("Wallet connect cancelled or failed:", error);
      setState((prev) => ({ ...prev, isLoading: false, error: null }));
    }
  }, [fetchCheeseBalance]);

  const disconnect = useCallback(async () => {
    try {
      const kit = getSessionKit();
      await kit.logout();
      setState({
        session: null,
        isConnected: false,
        accountName: null,
        isLoading: false,
        error: null,
        cheeseBalance: 0,
        isLoadingBalance: false,
      });
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }, []);

  const refreshBalance = useCallback(() => {
    if (state.accountName) {
      fetchCheeseBalance(state.accountName);
    }
  }, [state.accountName, fetchCheeseBalance]);

  return {
    ...state,
    connect,
    disconnect,
    refreshBalance,
  };
};
