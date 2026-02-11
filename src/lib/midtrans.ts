
// @ts-ignore
import midtransClient from 'midtrans-client';

/**
 * Midtrans Snap client initialization.
 * Using environment variables for security.
 */
export const snap = new midtransClient.Snap({
  isProduction: false, // Set to true for production
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-YOUR_KEY',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-YOUR_KEY'
});
