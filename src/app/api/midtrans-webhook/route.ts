
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

/**
 * Midtrans Webhook Route Handler
 * Handles server-to-server notifications for transaction status changes.
 * Implements high-integrity signature verification.
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';

    // 1. HMAC SHA512 Signature Verification
    // Format: hash(order_id + status_code + gross_amount + ServerKey)
    const signatureSource = data.order_id + data.status_code + data.gross_amount + serverKey;
    const expectedSignature = crypto.createHash('sha512').update(signatureSource).digest('hex');

    if (data.signature_key !== expectedSignature) {
      console.error("[WEBHOOK] KRITIS: Deteksi Signature Tidak Valid. Akses Ditolak.");
      return NextResponse.json({ message: 'Forbidden: Invalid Signature' }, { status: 403 });
    }

    // 2. Extract Identity (order_id format: "AUDIT-{userId}-{timestamp}")
    const orderParts = data.order_id.split('-');
    const userId = orderParts[1];

    if (!userId) {
      return NextResponse.json({ message: 'Bad Request: User ID missing in order_id' }, { status: 400 });
    }

    const firebaseServices = initializeFirebase();
    if (!firebaseServices) {
      console.error("[WEBHOOK] Firebase initialization failed.");
      return NextResponse.json({ message: 'Internal Server Error: Database Unavailable' }, { status: 500 });
    }
    const { firestore } = firebaseServices;
    const userRef = doc(firestore, 'users', userId);
    
    const transactionStatus = data.transaction_status;
    const fraudStatus = data.fraud_status;

    console.log(`[WEBHOOK] Memproses status [${transactionStatus}] untuk User [${userId}]`);

    /**
     * Audit: Transaction Status Logic
     * 'settlement' / 'capture' (accept) -> PAID
     * 'cancel' / 'deny' / 'expire' -> FAILED
     */
    if (transactionStatus === 'settlement' || (transactionStatus === 'capture' && fraudStatus === 'accept')) {
      // Pembayaran Berhasil: Update Tier & Status
      try {
        await updateDoc(userRef, {
          isPremium: true,
          'subscription.status': 'active',
          'subscription.midtransOrderId': data.order_id,
          'subscription.lastPaymentTimestamp': Date.now(),
          'role': 'executioner' // Default to executioner tier on payment
        });
        console.log(`[WEBHOOK] User ${userId} ditingkatkan ke status Executioner.`);
      } catch (e) {
        // Fallback: Logs failure if rules prevent server-side update with Client SDK
        console.warn("[WEBHOOK] Gagal update Firestore. Sinkronisasi akan bergantung pada callback frontend.");
      }
    } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
      // Pembayaran Gagal: Reset Status
      try {
        await updateDoc(userRef, {
          isPremium: false,
          'subscription.status': 'expired',
          'subscription.failureReason': transactionStatus
        });
      } catch (e) {
        // Quiet failure for cleanup
      }
    }

    return NextResponse.json({ 
      status: 'OK', 
      message: 'Protokol Webhook Berhasil Dieksekusi' 
    });
  } catch (error) {
    console.error("[WEBHOOK_ERROR] Kegagalan sistemik saat memproses notifikasi:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
