import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { initializePlatform } from '@/lib/api';
import { Settings, Loader2, CheckCircle } from 'lucide-react';

export default function PlatformSetup() {
  const { connected } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const handleInitialize = async () => {
    if (!connected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to initialize the platform.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await initializePlatform();
      if (result.ok) {
        setInitialized(true);
        toast({
          title: 'Platform Initialized',
          description: `Platform PDA: ${result.platformPda}`,
        });
      } else {
        throw new Error(result.error || 'Failed to initialize platform');
      }
    } catch (error) {
      toast({
        title: 'Initialization Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Platform Setup</h1>
        <p className="text-muted-foreground">
          Initialize the CertChain platform on the Solana blockchain
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Platform Initialization</CardTitle>
              <CardDescription>
                Set up the core platform contract on Solana blockchain
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium text-foreground mb-2">What happens during initialization?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Creates the main platform account (PDA)</li>
                <li>• Sets up authority and governance</li>
                <li>• Initializes counters for institutions and certificates</li>
                <li>• Deploys smart contract infrastructure</li>
              </ul>
            </div>

            {!connected && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-warning text-sm font-medium">
                  Please connect your wallet to proceed with platform initialization.
                </p>
              </div>
            )}

            {initialized && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <p className="text-success text-sm font-medium">
                  Platform has been successfully initialized!
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleInitialize}
              disabled={!connected || loading || initialized}
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialized ? 'Platform Initialized' : 'Initialize Platform'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              • Platform initialization is a one-time operation that sets up the core infrastructure.
            </p>
            <p>
              • Make sure you have sufficient SOL in your wallet to cover transaction fees.
            </p>
            <p>
              • Once initialized, institutions can register and begin issuing certificates.
            </p>
            <p>
              • This operation requires platform authority permissions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}