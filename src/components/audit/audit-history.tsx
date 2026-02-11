
"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ghost, Calendar, TrendingDown, Skull, History } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import TypewriterEffect from '@/components/ui/typewriter-effect';

export function AuditHistory() {
  const { user } = useUser();
  const firestore = useFirestore();

  // We fetch a larger limit for the "Archive" view
  const historyQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'audit_logs'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
  }, [user, firestore]);

  const { data: logs, isLoading } = useCollection(historyQuery);

  if (isLoading) {
    return (
      <div className="space-y-4 mt-16">
        <div className="h-40 bg-white/5 animate-pulse rounded-lg" />
        <div className="h-20 bg-white/5 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!logs || logs.length === 0) return null;

  // Calculate total wasted based on loaded logs
  const totalWasted = logs.reduce((acc, log) => acc + (log.output.opportunity_cost_idr || 0), 0);

  return (
    <div className="space-y-8 mt-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header: Total Kerugian Akumulatif */}
      <div className="border border-primary/30 bg-primary/5 p-8 rounded-lg text-center backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        <h2 className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-bold">
          Monumen Kerugian Terdeteksi
        </h2>
        <div className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 terminal-text">
          Rp {totalWasted.toLocaleString('id-ID')}
        </div>
        <p className="text-[10px] italic text-zinc-500 max-w-md mx-auto leading-relaxed">
          "Ini adalah estimasi akumulasi harga dari keraguan Anda. Bayangkan apa yang bisa Anda beli dengan angka ini jika Anda berhenti menunda."
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Ghost size={14} className="text-zinc-600" />
            Arsip Dosa (Log Audit)
          </h3>
          <Badge variant="outline" className="text-[9px] border-zinc-800 text-zinc-500 font-mono">
            {logs.length} ENTRIES_FOUND
          </Badge>
        </div>

        <div className="grid gap-4">
          {logs.map((log) => (
            <Card key={log.id} className="bg-black/40 border-white/5 hover:border-primary/20 transition-all duration-500 group">
              <CardContent className="p-5">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[9px] text-zinc-600 uppercase font-mono">
                      <Calendar size={10} />
                      {new Date(log.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      <span className="opacity-30">•</span>
                      <span>{formatDistanceToNow(log.timestamp, { addSuffix: true, locale: id })}</span>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-tight group-hover:text-primary transition-colors">
                      {log.output.diagnosis_title}
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-primary text-xs font-bold">
                      <TrendingDown size={12} />
                      -Rp {log.output.opportunity_cost_idr.toLocaleString('id-ID')}
                    </div>
                    <Badge className={`text-[8px] mt-1 h-4 ${log.type === 'deep_audit' ? 'bg-primary/20 text-primary border-primary/20' : 'bg-zinc-800 text-zinc-500'}`}>
                      {log.type === 'deep_audit' ? 'DEEP_SCAN' : 'STANDARD'}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-[11px] text-zinc-500 leading-relaxed border-l border-zinc-800 pl-4 italic font-mono mb-4 line-clamp-2">
                  "{log.output.brutal_diagnosis}"
                </div>

                <div className="flex flex-wrap gap-2">
                  {log.output.strategic_commands.slice(0, 2).map((cmd, i) => (
                    <div key={i} className="text-[8px] bg-white/5 px-2 py-0.5 rounded border border-white/5 text-zinc-500 uppercase tracking-wider">
                      COMMAND_{i + 1}: {cmd.substring(0, 30)}...
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center py-10 opacity-20">
        <Skull size={32} className="mx-auto mb-2" />
        <p className="text-[9px] uppercase tracking-[0.3em]">Hanya eksekusi yang bisa menghapus catatan ini.</p>
      </div>
    </div>
  );
}
