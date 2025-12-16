import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const handleSignOut = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Welcome back, {user.email}</p>
          </div>
          <form action={handleSignOut}>
            <Button
              type="submit"
              variant="outline"
              className="border-slate-700 hover:bg-slate-800"
            >
              Sign Out
            </Button>
          </form>
        </div>

        {/* Security Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/tools/threat-intel">
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur hover:border-blue-500/50 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-blue-400">Threat Intelligence</CardTitle>
                <CardDescription className="text-slate-400">
                  Analyze IOCs and get threat intel
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/tools/ai-writing-assistant">
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur hover:border-cyan-500/50 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-cyan-400">AI Writing Assistant</CardTitle>
                <CardDescription className="text-slate-400">
                  Professional business communications
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur opacity-50">
            <CardHeader>
              <CardTitle className="text-slate-400">Vulnerability Scanner</CardTitle>
              <CardDescription className="text-slate-500">
                Coming soon
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur opacity-50">
            <CardHeader>
              <CardTitle className="text-slate-400">Log Analyzer</CardTitle>
              <CardDescription className="text-slate-500">
                Coming soon
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur opacity-50">
            <CardHeader>
              <CardTitle className="text-slate-400">Phishing Detector</CardTitle>
              <CardDescription className="text-slate-500">
                Coming soon
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur opacity-50">
            <CardHeader>
              <CardTitle className="text-slate-400">Incident Response</CardTitle>
              <CardDescription className="text-slate-500">
                Coming soon
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-slate-100">Recent Activity</CardTitle>
            <CardDescription className="text-slate-400">
              Your recent security analyses and scans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm">No recent activity to display.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
