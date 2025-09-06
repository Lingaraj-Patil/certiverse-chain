import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export function WalletButton() {
  const { connected } = useWallet();

  return (
    <div className="flex items-center gap-2">
      <WalletMultiButton 
        className="!bg-primary hover:!bg-primary-hover !text-primary-foreground !rounded-lg !px-4 !py-2 !text-sm !font-medium !transition-colors"
      />
      {connected && (
        <div className="flex items-center gap-2 text-success text-sm">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          Connected
        </div>
      )}
    </div>
  );
}