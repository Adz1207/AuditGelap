
"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export function ActiveCommandsList() {
  const { user } = useUser();
  const firestore = useFirestore();

  const commandsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'active_commands'),
      orderBy('deadline', 'asc')
    );
  }, [user, firestore]);

  const { data: commands, isLoading } = useCollection(commandsQuery);

  const handleComplete = (cmdId: string) => {
    if (!user || !firestore) return;
    const cmdRef = doc(firestore, 'users', user.uid, 'active_commands', cmdId);
    updateDoc(cmdRef, { status: 'completed' });
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
                  onClick={() => handleComplete(cmd.id)}
                  className="bg-accent/10 hover:bg-accent/20 text-accent p-2 rounded transition-colors group"
                >
                  <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
