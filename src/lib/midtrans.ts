
// @ts-ignore
import midtransClient from 'midtrans-client';

/**
 * Audit: Strict initialization of the Midtrans Snap client.
 * This ensures that API keys are present before the system attempts to process redemption payments.
 */
export const getMidtransClient = () => {
  // Prevent client-side execution
  if (typeof window !== 'undefined') {
    return null as any;
  }

  const serverKey = process.env['MIDTRANS_SERVER_KEY'];
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

  // Audit: Ensure keys are not empty or undefined
  if (!serverKey || !clientKey) {
    console.error("KRITIS: MIDTRANS_SERVER_KEY atau NEXT_PUBLIC_MIDTRANS_CLIENT_KEY tidak ditemukan di Environment Variables.");
    // In a real production environment, we throw to prevent silent failures
    if (process.env.NODE_ENV === 'production') {
      throw new Error("Sistem Gagal: Kunci API Midtrans tidak terkonfigurasi.");
    }
  }

  return new midtransClient.Snap({
    isProduction: process.env.NODE_ENV === 'production',
    serverKey: serverKey || 'SB-Mid-server-STUB',
    clientKey: clientKey || 'SB-Mid-client-STUB'
  });
};

