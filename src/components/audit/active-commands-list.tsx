"use client";

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle2, Clock, AlertCircle, Loader2, ShieldCheck, Send, ShieldAlert } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { verifyExecution, type VerifyExecutionOutput } from '@/ai/flows/verify-execution-flow';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Button } from '@/components/ui/button';

export function ActiveCommandsList() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [verifyingCmd, setVerifyingCmd] = useState<{ id: string, task: string } | null>(null);
  const [proofText, setProofText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerifyExecutionOutput | null>(null);

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

  const handleOpenVerify = (cmdId: string, taskTitle: string) => {
    setVerifyingCmd({ id: cmdId, task: taskTitle });
    setProofText('');
    setVerificationResult(null);
  };

  const handleVerifySubmission = async () => {
    if (!user || !firestore || !verifyingCmd || proofText.trim().length < 5) return;
    setIsProcessing(true);

    try {
      const result = await verifyExecution({
        taskTitle: verifyingCmd.task,
        executionProof: proofText,
        userName: userData?.name || 'User',
      });

      setVerificationResult(result);

      if (result.is_valid) {
        const cmdRef = doc(firestore, 'users', user.uid, 'active_commands', verifyingCmd.id);
        
        updateDoc(cmdRef, { 
          status: 'completed',
          completedAt: Date.now(),
          integrityScore: result.integrity_score,
          proof: proofText
        }).catch(async () => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: cmdRef.path,
            operation: 'update',
            requestResourceData: { status: 'completed' }
          }));
        });

        toast({
          title: "INTEGRITAS TERVERIFIKASI",
          description: result.resolution_message,
        });
        
        // Close dialog after a short delay to show result
        setTimeout(() => setVerifyingCmd(null), 3000);
      } else {
        toast({
          variant: "destructive",
          title: "DETEKSI BULLSHIT",
          description: result.resolution_message,
        });
      }
    } catch (error) {
      console.error("VERIFICATION_FAILURE:", error);
      toast({
        variant: "destructive",
        title: "KESALAHAN SISTEM",
        description: "Gagal memproses verifikasi integrity.",
      });
    } finally {
      setIsProcessing(false);
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
                        <>Integritas: {cmd.integrityScore}%</>
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
                  onClick={() => handleOpenVerify(cmd.id, cmd.task)}
                  className="bg-accent/10 hover:bg-accent/20 text-accent p-2 rounded transition-all group hover:scale-105 active:scale-95"
                  title="Verifikasi Eksekusi"
                >
                  <CheckCircle2 size={18} className="group-hover:text-green-500 transition-colors" />
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Verification Dialog */}
      <Dialog open={!!verifyingCmd} onOpenChange={() => !isProcessing && setVerifyingCmd(null)}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white font-mono">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-tighter flex items-center gap-2">
              <ShieldAlert className="text-primary" />
              Audit Integritas Eksekusi
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-[10px] uppercase">
              Tugas: {verifyingCmd?.task}
            </DialogDescription>
          </DialogHeader>

          {verificationResult ? (
            <div className="space-y-4 py-4">
              <div className={`p-4 border rounded ${verificationResult.is_valid ? 'border-green-900/50 bg-green-950/10' : 'border-primary/50 bg-primary/10'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase">Status Audit</span>
                  <Badge className={verificationResult.is_valid ? 'bg-green-600' : 'bg-primary'}>
                    {verificationResult.is_valid ? 'VALIDATED' : 'REJECTED'}
                  </Badge>
                </div>
                <div className="text-2xl font-black mb-2">SCORE: {verificationResult.integrity_score}</div>
                <p className="text-xs text-zinc-300 italic">"{verificationResult.analysis}"</p>
              </div>
              <p className="text-sm font-bold text-white">{verificationResult.resolution_message}</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <label className="text-[10px] text-zinc-500 uppercase">Jelaskan apa yang Anda lakukan secara teknis (Min. 10 Kata):</label>
              <Textarea 
                placeholder="Contoh: 'Sudah deploy 5 baris script automasi ke server prod...'"
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                disabled={isProcessing}
                className="bg-black border-zinc-800 text-sm h-32 resize-none"
              />
              <p className="text-[8px] text-primary italic uppercase tracking-widest">
                AI_DETECTOR: AKTIF. Deteksi bullshit di level maksimal.
              </p>
            </div>
          )}

          <DialogFooter>
            {!verificationResult && (
              <Button 
                onClick={handleVerifySubmission}
                disabled={isProcessing || proofText.trim().split(/\s+/).length < 3}
                className="w-full bg-white text-black hover:bg-primary hover:text-white font-bold uppercase text-xs tracking-widest"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <>KIRIM BUKTI <Send size={14} className="ml-2" /></>}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
