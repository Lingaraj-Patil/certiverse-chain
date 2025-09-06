import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useEvmWallet } from '@/hooks/use-evm-wallet';

export function WalletButton() {
  const { connected } = useWallet();
  const { isInstalled, isConnected, account, connect, disconnect } = useEvmWallet();

  const short = (addr?: string | null) => (addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '');

  return (
    <div className="flex items-center gap-2">
      <WalletMultiButton 
        className="!bg-primary hover:!bg-primary-hover !text-primary-foreground !rounded-lg !px-4 !py-2 !text-sm !font-medium !transition-colors"
      />

      {isInstalled ? (
        isConnected ? (
          <Button variant="secondary" onClick={disconnect} className="flex items-center gap-2">
            <Wallet className="h-4 w-4" /> MetaMask: {short(account)}
          </Button>
        ) : (
          <Button variant="outline" onClick={connect} className="flex items-center gap-2">
            <Wallet className="h-4 w-4" /> Connect MetaMask
          </Button>
        )
      ) : (
        <a href="https://metamask.io/download/" target="_blank" rel="noreferrer">
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" /> Install MetaMask
          </Button>
        </a>
      )}

      {(connected || isConnected) && (
        <div className="flex items-center gap-2 text-success text-sm">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          Connected
        </div>
      )}
    </div>
  );
}
