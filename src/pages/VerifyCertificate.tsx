import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { verifyCertificate, CertificateData } from '@/lib/api';
import { Search, Loader2, CheckCircle, AlertCircle, Calendar, User, GraduationCap } from 'lucide-react';

export default function VerifyCertificate() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [formData, setFormData] = useState({
    institution_pubkey: '',
    student_pubkey: '',
    index: '',
  });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.institution_pubkey.trim() || !formData.student_pubkey.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both institution and student public keys.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setCertificate(null);
    
    try {
      const payload = {
        institution_pubkey: formData.institution_pubkey,
        student_pubkey: formData.student_pubkey,
        ...(formData.index && { index: parseInt(formData.index) })
      };
      
      const result = await verifyCertificate(payload);
      if (result.ok) {
        setCertificate(result.certificate);
        toast({
          title: 'Certificate Found',
          description: 'Certificate verification completed successfully.',
        });
      } else {
        throw new Error(result.error || 'Certificate not found');
      }
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: error instanceof Error ? error.message : 'Certificate not found or invalid',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Verify Certificate</h1>
        <p className="text-muted-foreground">
          Verify the authenticity of a blockchain certificate
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Certificate Verification</CardTitle>
              <CardDescription>
                Enter the certificate details to verify its authenticity
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="institution_pubkey">Institution Public Key *</Label>
                <Input
                  id="institution_pubkey"
                  type="text"
                  placeholder="Institution's PDA"
                  value={formData.institution_pubkey}
                  onChange={(e) => setFormData({ ...formData, institution_pubkey: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="student_pubkey">Student Wallet Address *</Label>
                <Input
                  id="student_pubkey"
                  type="text"
                  placeholder="Student's wallet public key"
                  value={formData.student_pubkey}
                  onChange={(e) => setFormData({ ...formData, student_pubkey: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="index">Certificate Index (Optional)</Label>
              <Input
                id="index"
                type="number"
                placeholder="Certificate index number"
                value={formData.index}
                onChange={(e) => setFormData({ ...formData, index: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to search all certificates for this student-institution pair
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Certificate
            </Button>
          </form>
        </CardContent>
      </Card>

      {certificate && (
        <Card className="border-2 border-success/20 bg-success/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {certificate.is_revoked ? (
                  <AlertCircle className="h-8 w-8 text-destructive" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-success" />
                )}
                <div>
                  <CardTitle className={certificate.is_revoked ? 'text-destructive' : 'text-success'}>
                    {certificate.is_revoked ? 'Certificate Revoked' : 'Certificate Verified'}
                  </CardTitle>
                  <CardDescription>
                    Certificate found on blockchain - {certificate.is_revoked ? 'This certificate has been revoked' : 'Authentic and valid'}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={certificate.is_revoked ? 'destructive' : 'default'}>
                {certificate.is_revoked ? 'REVOKED' : 'VALID'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Student Name</p>
                    <p className="text-foreground font-semibold">{certificate.student_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Course</p>
                    <p className="text-foreground font-semibold">{certificate.course_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Issued On</p>
                    <p className="text-foreground font-semibold">{formatDate(certificate.issued_at)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Grade</p>
                  <Badge variant="outline" className="text-lg font-semibold">
                    {certificate.grade}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Duration</p>
                  <p className="text-foreground">{certificate.course_duration} months</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Certificate Index</p>
                  <p className="text-foreground">#{certificate.index}</p>
                </div>
              </div>
            </div>

            {certificate.skills_acquired && certificate.skills_acquired.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Skills Acquired</p>
                <div className="flex flex-wrap gap-2">
                  {certificate.skills_acquired.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Certificate PDA</span>
                <span className="font-mono">{certificate.pda}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Institution</span>
                <span className="font-mono">{certificate.institution}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Student Wallet</span>
                <span className="font-mono">{certificate.student_wallet}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}