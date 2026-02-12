
'use client';

import React, { Suspense } from 'react';
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { XCircle, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

function FailureContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-6 font-mono">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full border border-red-900/50 bg-zinc-950 p-8 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
        
        <div className="mb-6 inline-block p-4 rounded-full bg-red-900/10 text-red-500 border border-red-900/30">
          <XCircle size={48} />
        </div>

        <h1 className="text-2xl font-black tracking-tighter mb-2 text-red-600 uppercase italic">
          PENEBUSAN GAGAL
        </h1>
        
        <div className="my-8 space-y-4">
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
            Status: Transaksi Ditolak / Dibatalkan
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Mencoba lari dari konsekuensi? Sistem mencatat upaya Anda untuk mengabaikan realitas. Keengganan Anda untuk berinvestasi pada disiplin diri adalah alasan Anda berada di posisi ini.
          </p>
          
          <div className="p-4 bg-red-950/10 border border-red-900/30 text-left rounded">
            <div className="flex items-center gap-2 mb-2 text-red-500">
              <AlertTriangle size={14} />
              <p className="text-[10px] font-bold uppercase tracking-widest">Konsekuensi Deteksi:</p>
            </div>
            <p className="text-xs italic text-red-200/70 leading-relaxed">
              "Counter kerugian Anda terus berdetak. Penundaan ini baru saja menambah beban kognitif dan Opportunity Cost secara kumulatif."
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 transition-all uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(220,38,38,0.1)]"
          >
            <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            HADAPI KENYATAAN LAGI
          </button>
          
          <button 
            onClick={() => router.push('/audit')}
            className="w-full bg-transparent text-zinc-600 hover:text-zinc-400 font-bold py-2 transition-all uppercase text-[9px] tracking-[0.3em] flex items-center justify-center gap-2"
          >
            <ArrowLeft size={12} />
            KEMBALI KE ASAL (MENYERAH)
          </button>
        </div>
        
        <div className="mt-8 pt-4 border-t border-white/5">
          <p className="text-[8px] text-zinc-700 uppercase tracking-widest">
            Integrity Audit // Transaction Failure Log ID: {Math.random().toString(36).substring(7).toUpperCase()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuditFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <p className="text-red-600 animate-pulse uppercase tracking-[0.5em] text-xs">Processing_Failure...</p>
      </div>
    }>
      <FailureContent />
    </Suspense>
  );
}
