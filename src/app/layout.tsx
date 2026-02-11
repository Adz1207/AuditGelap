
import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Auditgelap | Realitas Pahit Masa Depan Anda',
  description: 'Sistem audit bertenaga AI yang membedah delusi Anda menjadi angka kerugian riil.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden">
        <FirebaseClientProvider>
          <div className="scan-line" />
          {children}
          <Toaster />
          {/* Midtrans Snap Script */}
          <Script 
            src="https://app.sandbox.midtrans.com/snap/snap.js" 
            data-client-key={process.env.MIDTRANS_CLIENT_KEY || "SB-Mid-client-YOUR_KEY"}
            strategy="lazyOnload"
          />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
