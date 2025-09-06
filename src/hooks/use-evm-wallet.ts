import { useEffect, useMemo, useState } from 'react';

export type EvmWallet = {
  isInstalled: boolean;
  isConnected: boolean;
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
};

export function useEvmWallet(): EvmWallet {
  const ethereum = (typeof window !== 'undefined' ? (window as any).ethereum : undefined);
  const isInstalled = useMemo(() => !!ethereum && !!ethereum.isMetaMask, [ethereum]);

  const [account, setAccount] = useState<string | null>(null);

  const isConnected = !!account;

  useEffect(() => {
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      setAccount(accounts && accounts.length > 0 ? accounts[0] : null);
    };

    ethereum.request?.({ method: 'eth_accounts' }).then((accounts: string[]) => {
      handleAccountsChanged(accounts);
    }).catch(() => {});

    ethereum.on?.('accountsChanged', handleAccountsChanged);
    return () => {
      ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
    };
  }, [ethereum]);

  const connect = async () => {
    if (!ethereum) throw new Error('MetaMask is not installed');
    const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts && accounts.length > 0 ? accounts[0] : null);
  };

  const disconnect = () => {
    // MetaMask cannot be programmatically disconnected; we just clear local state
    setAccount(null);
  };

  return { isInstalled, isConnected, account, connect, disconnect };
}
