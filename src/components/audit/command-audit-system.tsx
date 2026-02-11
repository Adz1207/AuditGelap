
"use client";

import { useEffect, useRef } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, updateDoc, increment, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Frown, Flame, ShieldAlert } from 'lucide-react';

/**
 * CommandAuditSystem
 * Automatically detects expired pending commands and updates them to 'failed'.
 * Triggers a 'scolding' notification based on the user's role.
 */
export function CommandAuditSystem() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const auditProcessed = useRef(false);

  // Get current user role and stats
  const userRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  
  // Query for pending commands
  const pendingCommandsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'active_commands'),
      where('status', '==', 'pending')
    );
  }, [user, firestore]);

  const { data: commands } = useCollection(pendingCommandsQuery);

  useEffect(() => {
    if (!user || !firestore || !commands || auditProcessed.current) return;

    const now = Date.now();
    const expired = commands.filter(cmd => cmd.deadline < now);

    if (expired.length > 0) {
      const batch = writeBatch(firestore);
      let totalFailed = 0;

      expired.forEach(cmd => {
        const cmdRef = doc(firestore, 'users', user.uid, 'active_commands', cmd.id);
        batch.update(cmdRef, { status: 'failed' });
        totalFailed++;
      });

      // Update user stats
      if (userRef) {
        batch.update(userRef, {
          'stats.failedCommands': increment(totalFailed)
        });
      }

      batch.commit().then(async () => {
        // Fetch user data for the scolding message
        // In a real app, we'd have the role in context, but we'll use a generic scold for now
        // or check if they have premium features
        const isExecutioner = expired.some(e => e.isPremiumFeature);
        
        toast({
          variant: "destructive",
          title: "⚠️ KEGAGALAN SISTEMIK TERDETEKSI",
          description: isExecutioner 
            ? "Anda membayar untuk disiplin, tapi Anda tetap memilih malas. Deadline lewat. Uang Anda hangus sia-sia."
            : "Deadline lewat. Alasan Anda menang lagi hari ini. Mau sampai kapan jadi penonton?",
        });
      }).catch((err) => {
         errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef?.path || 'unknown',
          operation: 'update',
          requestResourceData: { totalFailed }
        }));
      });

      auditProcessed.current = true;
    }
  }, [user, firestore, commands, userRef, toast]);

  return null;
}
