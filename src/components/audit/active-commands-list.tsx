"use client";

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { acknowledgeExecution } from '@/ai/flows/acknowledge-execution';

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

    try {
      const cmdRef = doc(firestore, 'users', user.uid, 'active_commands', cmdId);
      
      // Update Firestore
      updateDoc(cmdRef, { status: 'completed' });

      // Call AI for cold appreciation
      const { message } = await acknowledgeExecution({
        taskTitle,
        userName: userData?.name || 'User',
      });

      toast({
        title: "EKSEKUSI DICATAT",
        description: message,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setCompletingId(null);
    }
  };

  if (isLoading) return <div className="animate-pulse h-20 bg-white/5 rounded-lg" />;
  if (!commands || commands.length === 0) return null;

  return (
    <div className="space-y-6 mt-12">
      <div className="flex items-center gap-2 border-l-4 border-accent pl-4">
        <h3 className="text-lg font-bold uppercase tracking-tighter text-white">
          Pusat Komando Strategis
        </h3>
        <Badge variant="outline" className="text-[10px] border-accent/30 text-accent">AKTIF</Badge>
      </div>

      <div className="grid gap-4">
        {commands.map((cmd) => (
          <Card key={cmd.id} className={`bg-black/40 border-white/5 overflow-hidden transition-all ${cmd.status === 'failed' ? 'opacity-60 grayscale' : ''}`}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                {cmd.status === 'pending' && <Clock className="w-5 h-5 text-accent mt-1 shrink-0" />}
                {cmd.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 shrink-0" />}
                {cmd.status === 'failed' && <AlertCircle className="w-5 h-5 text-primary mt-1 shrink-0" />}
                
                <div>
                  <p className={`text-sm font-mono leading-tight ${cmd.status === 'completed' ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {cmd.task}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500">
                      Deadline: {formatDistanceToNow(cmd.deadline, { addSuffix: true, locale: id })}
                    </span>
                    {cmd.isPremiumFeature && (
                      <Badge className="bg-primary/20 text-primary border-none text-[8px] h-4">DEEP_AUDIT</Badge>
                    )}
                  </div>
                </div>
              </div>

              {cmd.status === 'pending' && (
                <button 
                  onClick={() => handleComplete(cmd.id, cmd.task)}
                  disabled={completingId === cmd.id}
                  className="bg-accent/10 hover:bg-accent/20 text-accent p-2 rounded transition-colors group disabled:opacity-50"
                >
                  {completingId === cmd.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
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
