"use client";

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { acknowledgeExecution } from '@/ai/flows/acknowledge-execution';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * ActiveCommandsList Component
 * Manages the display and execution of actionable commands assigned to the user.
 * Plugs "productivity leaks" by marking tasks as completed.
 */
export function ActiveCommandsList() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [completingId, setCompletingId] = useState<string | null>(null);

  const userRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userData } = useDoc(userRef);

  const commandsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'active_commands'),
      orderBy('deadline', 'asc')
    );
  }, [user, firestore]);

  const { data: commands, isLoading } = useCollection(commandsQuery);

  const handleComplete = async (cmdId: string, taskTitle: string) => {
    if (!user || !firestore) return;
    setCompletingId(cmdId);

    const cmdRef = doc(firestore, 'users', user.uid, 'active_commands', cmdId);
    
    // Non-blocking Firestore update for optimistic UI
    // We update the status and record the completion timestamp
    updateDoc(cmdRef, { 
      status: 'completed',
      completedAt: Date.now()
    }).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: cmdRef.path,
        operation: 'update',
        requestResourceData: { status: 'completed' }
      }));
    });

    try {
      // Call Genkit flow for a cold, sharp appreciation message
      const { message } = await acknowledgeExecution({
        taskTitle,
        userName: userData?.name || 'User',
      });

      toast({
        title: "EKSEKUSI DICATAT",
        description: message || "Eksekusi tercatat. Berhenti merasa puas, lanjut ke tugas berikutnya.",
      });
    } catch (error) {
      console.error("AI_ACKNOWLEDGEMENT_FAILURE:", error);
      toast({
        variant: "destructive",
        title: "KESALAHAN SISTEM",
        description: "Gagal memproses pengakuan AI. Namun, eksekusi fisik Anda tetap tersimpan di arsip.",
      });
    } finally {
      setCompletingId(null);
    }
  };

  if (isLoading) return <div className="animate-pulse h-20 bg-white/5 rounded-lg" />;
  if (!commands || commands.length === 0) return null;

  const pendingCount = commands.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-6 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-l-4 border-accent pl-4">
        <div>
          <h3 className="text-lg font-bold uppercase tracking-tighter text-white">
            Pusat Komando Strategis
          </h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
            Status: {pendingCount > 0 ? `${pendingCount} Kebocoran Aktif` : 'Sistem Stabil (Sesaat)'}
          </p>
        </div>
        <Badge variant="outline" className={`text-[10px] border-accent/30 ${pendingCount > 0 ? 'text-accent animate-pulse' : 'text-green-500'}`}>
          {pendingCount > 0 ? 'ALERT_MODE' : 'STABILIZED'}
        </Badge>
      </div>

      <div className="grid gap-4">
        {commands.map((cmd) => (
          <Card 
            key={cmd.id} 
            className={`bg-black/40 border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10 ${cmd.status === 'failed' ? 'opacity-40 grayscale' : ''} ${cmd.status === 'completed' ? 'border-green-900/30' : ''}`}
          >
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                {cmd.status === 'pending' && <Clock className="w-5 h-5 text-accent mt-1 shrink-0" />}
                {cmd.status === 'completed' && <ShieldCheck className="w-5 h-5 text-green-500 mt-1 shrink-0" />}
                {cmd.status === 'failed' && <AlertCircle className="w-5 h-5 text-primary mt-1 shrink-0" />}
                
                <div>
                  <p className={`text-sm font-mono leading-tight ${cmd.status === 'completed' ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                    {cmd.task}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500">
                      {cmd.status === 'pending' ? (
                        <>Deadline: {formatDistanceToNow(cmd.deadline, { addSuffix: true, locale: id })}</>
                      ) : cmd.status === 'completed' ? (
                        <>Berhasil Dieksekusi</>
                      ) : (
                        <>Kegagalan Sistemik</>
                      )}
                    </span>
                    {cmd.isPremiumFeature && (
                      <Badge className="bg-primary/20 text-primary border-none text-[8px] h-4">DEEP_AUDIT_CMD</Badge>
                    )}
                  </div>
                </div>
              </div>

              {cmd.status === 'pending' && (
                <button 
                  onClick={() => handleComplete(cmd.id, cmd.task)}
                  disabled={completingId === cmd.id}
                  className="bg-accent/10 hover:bg-accent/20 text-accent p-2 rounded transition-all group disabled:opacity-50 hover:scale-105 active:scale-95"
                  title="Tandai Selesai"
                >
                  {completingId === cmd.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={18} className="group-hover:text-green-500 transition-colors" />
                  )}
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}