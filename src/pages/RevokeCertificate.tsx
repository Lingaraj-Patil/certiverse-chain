import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { revokeCertificate } from '@/lib/api';
import { Ban, Loader2 } from 'lucide-react';

export default function RevokeCertificate() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tx, setTx] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    institution_pubkey: '',
    student_pubkey: '',
    index: '' as string,
  });

  useEffect(() => {
    document.title = 'Revoke Certificate | Admin Dashboard';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTx(null);

    if (!formData.institution_pubkey.trim() || !formData.student_pubkey.trim() || formData.index === '') {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const indexNum = Number(formData.index);
    if (Number.isNaN(indexNum) || indexNum < 0) {
      toast({ title: 'Invalid Index', description: 'Index must be a non-negative number.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const result = await revokeCertificate({
        institution_pubkey: formData.institution_pubkey.trim(),
        student_pubkey: formData.student_pubkey.trim(),
        index: indexNum,
      });

      if (result.ok) {
        setTx(result.tx);
        toast({ title: 'Certificate Revoked', description: `Transaction: ${result.tx}` });
        setFormData({ institution_pubkey: '', student_pubkey: '', index: '' });
      } else {
        throw new Error(result.error || 'Failed to revoke certificate');
      }
    } catch (error) {
      toast({
        title: 'Revoke Failed',
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
        <h1 className="text-3xl font-bold text-foreground">Revoke Certificate</h1>
        <p className="text-muted-foreground">Permanently mark a certificate as revoked on-chain</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center">
              <Ban className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Revoke Details</CardTitle>
              <CardDescription>Provide the certificate identifiers</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="institution_pubkey">Institution Pubkey *</Label>
              <Input
                id="institution_pubkey"
                type="text"
                placeholder="Institution public key"
                value={formData.institution_pubkey}
                onChange={(e) => setFormData({ ...formData, institution_pubkey: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="student_pubkey">Student Pubkey *</Label>
              <Input
                id="student_pubkey"
                type="text"
                placeholder="Student public key"
                value={formData.student_pubkey}
                onChange={(e) => setFormData({ ...formData, student_pubkey: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="index">Certificate Index *</Label>
              <Input
                id="index"
                type="number"
                min={0}
                placeholder="Index used during issuance"
                value={formData.index}
                onChange={(e) => setFormData({ ...formData, index: e.target.value })}
                required
              />
            </div>

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-warning text-sm font-medium">This action cannot be undone.</p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Revoke Certificate
            </Button>
          </form>
        </CardContent>
      </Card>

      {tx && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm break-all text-muted-foreground">{tx}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
