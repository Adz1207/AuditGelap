"use client";

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skull, Flame, TrendingDown, Loader2, MailWarning } from 'lucide-react';
import { generateWeeklyRoast, type WeeklyRoastOutput } from '@/ai/flows/generate-weekly-roast';
import TypewriterEffect from '@/components/ui/typewriter-effect';

export function WeeklyAuditReport() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<WeeklyRoastOutput | null>(null);

  const userRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userData } = useDoc(userRef);

  // Fetch failed commands from the last 7 days
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const failedCommandsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'active_commands'),
      where('status', '==', 'failed'),
      where('deadline', '>', sevenDaysAgo),
      limit(5)
    );
  }, [user, firestore]);

  const { data: failedCommands } = useCollection(failedCommandsQuery);

  const handleGenerateRoast = async () => {
    if (!user || !userData || !failedCommands) return;
    setLoading(true);
    
    try {
      // Calculate total loss from audit logs in the last week (simplification for MVP)
      const totalLoss = failedCommands.length * 10000000; // Mock calculation based on failed tasks

      const result = await generateWeeklyRoast({
        userName: userData.name || 'User',
        totalLossThisWeek: totalLoss,
        failedTasks: failedCommands.map(c => ({
          title: c.task,
          excuse: "Prokrastinasi sistemik",
          diagnosis: "Kegagalan eksekusi deadline."
        })),
        currentRole: userData.role as any || 'free'
      });
      setReport(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (userData?.role === 'free') return null;

  return (
    <div className="mt-16 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <MailWarning className="text-primary" size={20} />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Laporan Intelijen Mingguan</h3>
        </div>
        {!report && (
          <Button 
            onClick={handleGenerateRoast} 
            disabled={loading}
            variant="outline" 
            className="text-[10px] uppercase font-bold border-primary/30 text-primary hover:bg-primary/10"
          >
            {loading ? <Loader2 className="animate-spin w-3 h-3 mr-2" /> : <Flame className="w-3 h-3 mr-2" />}
            Generate Weekly Roast
          </Button>
        )}
      </div>

      {report && (
        <Card className="bg-primary/5 border-primary/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Skull size={80} />
          </div>
          <CardHeader className="pb-2">
            <Badge className="w-fit mb-2 bg-primary/20 text-primary border-none text-[8px]">URGENT_REPORT</Badge>
            <CardTitle className="text-xl font-black uppercase italic terminal-text text-white">
              {report.subject}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 font-mono text-xs leading-relaxed text-zinc-400">
            <div className="border-l-2 border-primary/50 pl-4">
              <TypewriterEffect text={report.opening} speed={0.01} />
            </div>

            <div className="bg-black/40 p-4 border border-white/5 rounded">
              <div className="flex items-center gap-2 text-primary mb-2">
                <TrendingDown size={14} />
                <span className="font-bold text-[10px] uppercase">Analisis Kerugian Finansial</span>
              </div>
              <p className="text-white italic">"{report.mathAnalysis}"</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-zinc-600 font-bold uppercase">The Reality Check:</span>
              <p className="text-zinc-300">
                <TypewriterEffect text={report.theRoast} speed={0.005} />
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-accent mb-2">
                <Loader2 className="animate-spin w-3 h-3" />
                <span className="font-bold text-[10px] uppercase">Perintah Strategis:</span>
              </div>
              <p className="text-white font-bold">{report.closingCommand}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
