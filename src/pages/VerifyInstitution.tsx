import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { verifyInstitution } from '@/lib/api';
import { Shield, Loader2, CheckCircle } from 'lucide-react';

export default function VerifyInstitution() {
  const { connected } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [institutionPubkey, setInstitutionPubkey] = useState('');
  const [verified, setVerified] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to verify an institution.',
        variant: 'destructive',
      });
      return;
    }

    if (!institutionPubkey.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter the institution public key.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await verifyInstitution({ institution_pubkey: institutionPubkey });
      if (result.ok) {
        setVerified(true);
        toast({
          title: 'Institution Verified',
          description: 'The institution has been successfully verified and can now issue certificates.',
        });
      } else {
        throw new Error(result.error || 'Failed to verify institution');
      }
    } catch (error) {
      toast({
        title: 'Verification Failed',
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
        <h1 className="text-3xl font-bold text-foreground">Verify Institution</h1>
        <p className="text-muted-foreground">
          Verify a registered institution to enable certificate issuance
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Institution Verification</CardTitle>
              <CardDescription>
                Verify an institution's authenticity and authorize certificate issuance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pubkey">Institution Public Key *</Label>
              <Input
                id="pubkey"
                type="text"
                placeholder="Enter institution's public key (PDA)"
                value={institutionPubkey}
                onChange={(e) => setInstitutionPubkey(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                The public key (PDA) generated during institution registration
              </p>
            </div>

            {verified && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <p className="text-success text-sm font-medium">
                  Institution has been successfully verified!
                </p>
              </div>
            )}

            {!connected && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-warning text-sm font-medium">
                  Please connect your wallet to verify an institution.
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={!connected || loading || verified}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {verified ? 'Institution Verified' : 'Verify Institution'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              • Only platform authorities can verify institutions
            </p>
            <p>
              • Verification enables the institution to issue blockchain certificates
            </p>
            <p>
              • Verified institutions can track their certificate issuance statistics
            </p>
            <p>
              • This action updates the institution's verification status on-chain
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}