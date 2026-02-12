
"use client";

import { useState, useEffect } from 'react';
import { AuditForm } from './audit-form';
import { AuditResults } from './audit-results';
import { AuditScanning } from './audit-scanning';
import { generateAuditAndInsights, type AuditOutput } from '@/ai/flows/generate-audit-and-insights';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, collection, setDoc, updateDoc, increment } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function AuditContainer() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState<AuditOutput | null>(null);
  const [lastInput, setLastInput] = useState<any>(null);
  const [langUsed, setLangUsed] = useState<'Indonesian' | 'English'>('Indonesian');
  const { toast } = useToast();

  // Fetch current user data to check premium status
  const userRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userData } = useDoc(userRef);

  const handleAudit = async (formData: { 
    projectName: string, 
    estimatedValue: number, 
    sabotageType: string, 
    details: string, 
    lang: 'Indonesian' | 'English' 
  }) => {
    setLoading(true);
    setAuditData(null);
    setLangUsed(formData.lang);
    setLastInput(formData);
    
    try {
      const isPremium = userData?.isPremium || false;
      const result = await generateAuditAndInsights({ 
        projectName: formData.projectName,
        estimatedValue: formData.estimatedValue,
        sabotageType: formData.sabotageType,
        situationDetails: formData.details,
        langPreference: formData.lang,
        isPremiumUser: isPremium
      });
      
      // Artificial delay to allow the AuditScanning animation to play through its sequence
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      setAuditData(result);

      // Persist the audit log and commands if the user is authenticated
      if (user && firestore) {
        const auditLogRef = doc(collection(firestore, 'users', user.uid, 'audit_logs'));
        const auditLogData = {
          userId: user.uid,
          input: { 
            projectName: formData.projectName,
            estimatedValue: formData.estimatedValue,
            sabotageType: formData.sabotageType,
            situationDetails: formData.details, 
            langPreference: formData.lang 
          },
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
        const userUpdateRef = doc(firestore, 'users', user.uid);
        const statsUpdate = {
          'stats.totalAudits': increment(1),
          'stats.totalLossObserved': increment(result.opportunity_cost_idr)
        };
        updateDoc(userUpdateRef, statsUpdate).catch(async () => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userUpdateRef.path,
            operation: 'update',
            requestResourceData: statsUpdate
          }));
        });

        // Create Active Commands from the output if not locked
        if (!result.isLocked) {
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

  const handleRefreshProtocol = () => {
    if (lastInput) {
      handleAudit(lastInput);
      toast({
        title: "SYNCHRONIZING PROTOCOL",
        description: "Memverifikasi status penebusan dan membuka akses data...",
      });
    }
  };

  // Automate Re-fetch on payment success signal
  useEffect(() => {
    const handleRedemptionSignal = () => {
      if (lastInput && auditData?.isLocked) {
        handleAudit(lastInput);
      }
    };

    window.addEventListener('redemption-success', handleRedemptionSignal);
    return () => window.removeEventListener('redemption-success', handleRedemptionSignal);
  }, [lastInput, auditData?.isLocked]);

  return (
    <div className="space-y-12">
      {!auditData && !loading && <AuditForm onSubmit={handleAudit} isLoading={loading} />}
      
      {loading && <AuditScanning />}

      {auditData && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           <AuditResults 
            data={auditData} 
            lang={langUsed} 
            onRefresh={handleRefreshProtocol}
            isRefreshing={loading}
          />
          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setAuditData(null);
                setLastInput(null);
              }}
              className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-[0.3em] transition-colors"
            >
              Reset Interface // Mulai Audit Baru
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
