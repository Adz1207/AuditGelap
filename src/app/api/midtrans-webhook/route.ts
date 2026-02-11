
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

/**
 * Midtrans Webhook Route Handler
 * Handles server-to-server notifications for transaction status changes.
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';

    // 1. Verifikasi Signature Key
    // Rumus: hash(order_id + status_code + gross_amount + ServerKey)
    const signatureSource = data.order_id + data.status_code + data.gross_amount + serverKey;
    const expectedSignature = crypto.createHash('sha512').update(signatureSource).digest('hex');

    if (data.signature_key !== expectedSignature) {
      console.error("[WEBHOOK] Unauthorized: Invalid Signature Detected.");
      return NextResponse.json({ message: 'Invalid Signature' }, { status: 403 });
    }

    // 2. Parsing Metadata (Format order_id: "AUDIT-{userId}-{timestamp}")
    const orderParts = data.order_id.split('-');
    const userId = orderParts[1];

    if (!userId) {
      return NextResponse.json({ message: 'User ID missing in order_id' }, { status: 400 });
    }

    const { firestore } = initializeFirebase();
    const userRef = doc(firestore, 'users', userId);
    
    const transactionStatus = data.transaction_status;
    const fraudStatus = data.fraud_status;

    console.log(`[WEBHOOK] Processing ${transactionStatus} for user ${userId}`);

    /**
     * NOTE: In this prototype environment using the Client SDK on the server,
     * this updateDoc call will be subject to Firestore Security Rules.
     * Since the 'server' is not authenticated as the user, this may fail.
     * The primary update logic resides in the frontend callback for this MVP.
     */
    if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
      if (fraudStatus === 'accept' || !fraudStatus) {
        // Pembayaran Berhasil
        try {
          await updateDoc(userRef, {
            isPremium: true,
            'subscription.status': 'active',
            'subscription.midtransOrderId': data.order_id,
            // We set a generic role here if specific plan info isn't in metadata
            'role': 'executioner' 
          });
          console.log(`[WEBHOOK] User ${userId} promoted to Premium.`);
        } catch (e) {
          console.warn("[WEBHOOK] Firestore update failed. Relying on frontend callback for prototype.");
        }
      }
    } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
      // Pembayaran Gagal
      try {
        await updateDoc(userRef, {
          isPremium: false,
          'subscription.status': 'expired'
        });
      } catch (e) {
        // Log quietly as this is a fallback
      }
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
