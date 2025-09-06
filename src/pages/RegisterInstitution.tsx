import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { registerInstitution } from '@/lib/api';
import { Building2, Loader2 } from 'lucide-react';

export default function RegisterInstitution() {
  const { connected } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    verification_hash: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to register an institution.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.name.trim() || !formData.verification_hash.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await registerInstitution(formData);
      if (result.ok) {
        toast({
          title: 'Institution Registered',
          description: `Institution PDA: ${result.institution}`,
        });
        setFormData({ name: '', verification_hash: '' });
      } else {
        throw new Error(result.error || 'Failed to register institution');
      }
    } catch (error) {
      toast({
        title: 'Registration Failed',
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
        <h1 className="text-3xl font-bold text-foreground">Register Institution</h1>
        <p className="text-muted-foreground">
          Add a new educational institution to the CertChain platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Institution Details</CardTitle>
              <CardDescription>
                Provide information about the educational institution
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Institution Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Massachusetts Institute of Technology"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Official name of the educational institution
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification_hash">Verification Hash *</Label>
              <Textarea
                id="verification_hash"
                placeholder="Enter verification hash or identifier"
                value={formData.verification_hash}
                onChange={(e) => setFormData({ ...formData, verification_hash: e.target.value })}
                rows={3}
                required
              />
              <p className="text-xs text-muted-foreground">
                Unique hash or identifier for institution verification
              </p>
            </div>

            {!connected && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-warning text-sm font-medium">
                  Please connect your wallet to register an institution.
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={!connected || loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Institution
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registration Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              • Registration creates a unique Program Derived Address (PDA) for the institution
            </p>
            <p>
              • The institution will need verification from platform authority to issue certificates
            </p>
            <p>
              • Once verified, the institution can begin issuing blockchain certificates
            </p>
            <p>
              • All certificate issuances will be tracked and attributed to this institution
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}