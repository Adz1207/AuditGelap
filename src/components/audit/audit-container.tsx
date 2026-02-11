
"use client";

import { useState } from 'react';
import { AuditForm } from './audit-form';
import { AuditResults } from './audit-results';
import { generateAuditAndInsights, type AuditOutput } from '@/ai/flows/generate-audit-and-insights';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, collection, setDoc, updateDoc, increment } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Loader2 } from 'lucide-react';

export function AuditContainer() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState<AuditOutput | null>(null);
  const [langUsed, setLangUsed] = useState<'Indonesian' | 'English'>('Indonesian');
  const { toast } = useToast();

  // Fetch current user data to check premium status
  const userRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userData } = useDoc(userRef);

  const handleAudit = async (situation: string, lang: 'Indonesian' | 'English') => {
    setLoading(true);
    setAuditData(null);
    setLangUsed(lang);
    
    try {
      const isPremium = userData?.isPremium || false;
      const result = await generateAuditAndInsights({ 
        situationDetails: situation,
        langPreference: lang,
        isPremiumUser: isPremium
      });
      
      setAuditData(result);

      // Persist the audit log and commands if the user is authenticated
      if (user && firestore) {
        const auditLogRef = doc(collection(firestore, 'users', user.uid, 'audit_logs'));
        const auditLogData = {
          userId: user.uid,
          input: { situationDetails: situation, langPreference: lang },
          output: result,
          type: result.type,
          timestamp: Date.now()
        };

        // Non-blocking save for Audit Log
        setDoc(auditLogRef, auditLogData).catch(async () => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: auditLogRef.path,
            operation: 'create',
            requestResourceData: auditLogData
          }));
        });

        // Update User Stats (Atomic increment)
        const userRef = doc(firestore, 'users', user.uid);
        const statsUpdate = {
          'stats.totalAudits': increment(1),
          'stats.totalLossObserved': increment(result.opportunity_cost_idr)
        };
        updateDoc(userRef, statsUpdate).catch(async () => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: statsUpdate
          }));
        });

        // Create Active Commands from the output
        result.strategic_commands.forEach((task) => {
          const commandRef = doc(collection(firestore, 'users', user.uid, 'active_commands'));
          const commandData = {
            userId: user.uid,
            auditId: auditLogRef.id,
            task: task,
            deadline: Date.now() + (24 * 60 * 60 * 1000), // 24 hour deadline
            status: 'pending',
            isPremiumFeature: result.type === 'deep_audit'
          };

          setDoc(commandRef, commandData).catch(async () => {
             errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: commandRef.path,
              operation: 'create',
              requestResourceData: commandData
            }));
          });
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "System Failure",
        description: "Gagal menghubungkan ke modul intelijen AI. Coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <AuditForm onSubmit={handleAudit} isLoading={loading} />
      
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="font-mono text-sm uppercase tracking-widest text-primary animate-pulse">
            Membedah Delusi... Memindai Penyesalan...
          </p>
        </div>
      )}

      {auditData && <AuditResults data={auditData} lang={langUsed} />}
    </div>
  );
}
