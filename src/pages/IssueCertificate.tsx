import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { issueCertificate } from '@/lib/api';
import { Plus, Loader2, X } from 'lucide-react';

export default function IssueCertificate() {
  const { connected } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    institution_pubkey: '',
    student_pubkey: '',
    student_name: '',
    course_name: '',
    course_duration: '',
    skills_acquired: [] as string[],
    grade: '',
    metadata_uri: '',
  });

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills_acquired.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills_acquired: [...formData.skills_acquired, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills_acquired: formData.skills_acquired.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to issue a certificate.',
        variant: 'destructive',
      });
      return;
    }

    const requiredFields = ['institution_pubkey', 'student_pubkey', 'student_name', 'course_name', 'course_duration', 'grade'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        course_duration: parseInt(formData.course_duration),
      };
      
      const result = await issueCertificate(payload);
      if (result.ok) {
        toast({
          title: 'Certificate Issued',
          description: `Certificate PDA: ${result.certificate}`,
        });
        // Reset form
        setFormData({
          institution_pubkey: '',
          student_pubkey: '',
          student_name: '',
          course_name: '',
          course_duration: '',
          skills_acquired: [],
          grade: '',
          metadata_uri: '',
        });
      } else {
        throw new Error(result.error || 'Failed to issue certificate');
      }
    } catch (error) {
      toast({
        title: 'Certificate Issuance Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Issue Certificate</h1>
        <p className="text-muted-foreground">
          Create and issue a blockchain certificate to a student
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Certificate Details</CardTitle>
              <CardDescription>
                Fill in the information for the certificate to be issued
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="student_name">Student Name *</Label>
                <Input
                  id="student_name"
                  type="text"
                  placeholder="e.g., John Smith"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course_name">Course Name *</Label>
                <Input
                  id="course_name"
                  type="text"
                  placeholder="e.g., Computer Science Degree"
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="course_duration">Course Duration (months) *</Label>
                <Input
                  id="course_duration"
                  type="number"
                  placeholder="e.g., 48"
                  value={formData.course_duration}
                  onChange={(e) => setFormData({ ...formData, course_duration: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Input
                  id="grade"
                  type="text"
                  placeholder="e.g., A+, 95%, Distinction"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills Acquired</Label>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  type="text"
                  placeholder="Add a skill and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              {formData.skills_acquired.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills_acquired.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadata_uri">Metadata URI (Optional)</Label>
              <Textarea
                id="metadata_uri"
                placeholder="IPFS or HTTP URL to additional certificate metadata"
                value={formData.metadata_uri}
                onChange={(e) => setFormData({ ...formData, metadata_uri: e.target.value })}
                rows={2}
              />
            </div>

            {!connected && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-warning text-sm font-medium">
                  Please connect your wallet to issue a certificate.
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={!connected || loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Issue Certificate
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}