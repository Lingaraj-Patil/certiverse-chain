import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, Calendar, User, GraduationCap, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data - in a real app, this would come from your API
const mockCertificates = [
  {
    id: '1',
    student_name: 'John Smith',
    course_name: 'Computer Science Degree',
    institution: 'MIT',
    grade: 'A+',
    issued_at: Date.now() - 86400000 * 30,
    is_revoked: false,
    skills: ['JavaScript', 'Python', 'React', 'Blockchain']
  },
  {
    id: '2',
    student_name: 'Sarah Johnson',
    course_name: 'Data Science Certificate',
    institution: 'Stanford',
    grade: '95%',
    issued_at: Date.now() - 86400000 * 15,
    is_revoked: false,
    skills: ['Python', 'Machine Learning', 'SQL', 'Statistics']
  },
  {
    id: '3',
    student_name: 'Mike Davis',
    course_name: 'Web Development Bootcamp',
    institution: 'Tech Academy',
    grade: 'Distinction',
    issued_at: Date.now() - 86400000 * 7,
    is_revoked: true,
    skills: ['HTML', 'CSS', 'JavaScript', 'Node.js']
  }
];

export default function Certificates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates] = useState(mockCertificates);

  const filteredCertificates = certificates.filter(cert =>
    cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Certificates</h1>
          <p className="text-muted-foreground">
            View and manage all issued certificates
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Certificates</p>
                <p className="text-2xl font-bold">{certificates.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valid Certificates</p>
                <p className="text-2xl font-bold text-success">
                  {certificates.filter(c => !c.is_revoked).length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revoked</p>
                <p className="text-2xl font-bold text-destructive">
                  {certificates.filter(c => c.is_revoked).length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates List */}
      <div className="space-y-4">
        {filteredCertificates.map((certificate) => (
          <Card key={certificate.id} className={`transition-all hover:shadow-md ${certificate.is_revoked ? 'border-destructive/20 bg-destructive/5' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    certificate.is_revoked 
                      ? 'bg-destructive/10 text-destructive' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{certificate.course_name}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {certificate.student_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {certificate.institution}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(certificate.issued_at)}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={certificate.is_revoked ? 'destructive' : 'default'}>
                    {certificate.is_revoked ? 'REVOKED' : 'VALID'}
                  </Badge>
                  <Badge variant="outline" className="font-semibold">
                    {certificate.grade}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Download PDF</DropdownMenuItem>
                      {!certificate.is_revoked && (
                        <DropdownMenuItem className="text-destructive">
                          Revoke Certificate
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Skills Acquired</p>
                  <div className="flex flex-wrap gap-2">
                    {certificate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCertificates.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No certificates found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? `No certificates match "${searchTerm}". Try adjusting your search.`
                  : 'No certificates have been issued yet.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}