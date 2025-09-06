import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, FileText, Shield, Plus, TrendingUp, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const stats = [
  {
    title: 'Total Certificates',
    value: '1,234',
    change: '+12.5%',
    icon: FileText,
    color: 'text-blue-600'
  },
  {
    title: 'Verified Institutions',
    value: '89',
    change: '+4.1%',
    icon: Building2,
    color: 'text-green-600'
  },
  {
    title: 'Active Students',
    value: '5,678',
    change: '+8.2%',
    icon: Users,
    color: 'text-purple-600'
  },
  {
    title: 'Platform Growth',
    value: '23.8%',
    change: '+2.4%',
    icon: TrendingUp,
    color: 'text-orange-600'
  }
];

const quickActions = [
  {
    title: 'Register Institution',
    description: 'Add a new educational institution to the platform',
    href: '/institution/register',
    icon: Building2,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Issue Certificate',
    description: 'Create and issue a new certificate to a student',
    href: '/certificate/issue',
    icon: Plus,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Verify Certificate',
    description: 'Verify the authenticity of an existing certificate',
    href: '/certificate/verify',
    icon: Shield,
    color: 'bg-purple-100 text-purple-600'
  }
];

export default function Dashboard() {
  const { connected, publicKey } = useWallet();
  const { toast } = useToast();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to CertChain - Blockchain Certificate Management Platform
          </p>
        </div>
        {!connected && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-warning">
                <Shield className="h-5 w-5" />
                <p className="text-sm font-medium">Please connect your wallet to access all features</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-success">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-all hover:scale-105">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to={action.href}>Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest transactions and updates on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Certificate issued to John Doe</p>
                  <p className="text-xs text-muted-foreground">Computer Science Degree - MIT</p>
                </div>
                <div className="text-xs text-muted-foreground">2 hours ago</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}