
"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, TrendingDown, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export function AuditHistory() {
  const { user } = useUser();
  const firestore = useFirestore();

  const historyQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'audit_logs'),
      orderBy('timestamp', 'desc'),
      limit(5)
    );
  }, [user, firestore]);

  const { data: logs, isLoading } = useCollection(historyQuery);

  if (isLoading) return <div className="animate-pulse h-20 bg-white/5 rounded-lg mt-8" />;
  if (!logs || logs.length === 0) return null;

  return (
    <div className="space-y-6 mt-16">
      <div className="flex items-center gap-2 border-l-4 border-primary/50 pl-4">
        <h3 className="text-lg font-bold uppercase tracking-tighter text-white/80">
          Arsip Dosa (Log Audit Terakhir)
        </h3>
        <History size={16} className="text-muted-foreground" />
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <Card key={log.id} className="bg-black/20 border-white/5 hover:border-white/10 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-tight">
                    {log.output.diagnosis_title}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {formatDistanceToNow(log.timestamp, { addSuffix: true, locale: id })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary text-xs font-bold">
                    <TrendingDown size={12} />
                    Rp {log.output.opportunity_cost_idr.toLocaleString('id-ID')}
                  </div>
                  <Badge variant="outline" className="text-[8px] mt-1 border-white/10 text-zinc-500">
                    {log.type === 'deep_audit' ? 'DEEP' : 'STANDARD'}
                  </Badge>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 mt-3 line-clamp-1 italic font-mono border-l border-zinc-800 pl-2">
                "{log.input.situationDetails}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
