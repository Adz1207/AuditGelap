import type {Metadata} from 'next';
import './globals.css';

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
        <div className="scan-line" />
        {children}
      </body>
    </html>
  );
}