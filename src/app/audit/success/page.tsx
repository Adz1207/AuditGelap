
'use client';

import React, { Suspense } from 'react';
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get('order_id') || 'UNKNOWN';

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-6 font-mono">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full border border-green-900/50 bg-zinc-950 p-8 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-600 to-transparent opacity-50" />
        
        <div className="mb-6 inline-block p-4 rounded-full bg-green-900/10 text-green-500 border border-green-900/30">
          <CheckCircle2 size={48} />
        </div>

        <h1 className="text-2xl font-black tracking-tighter mb-2 text-green-500 uppercase italic">
          TRANSAKSI DIVALIDASI
        </h1>
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-6 font-bold">
          Order ID: <span className="text-zinc-300">#{orderId}</span>
        </p>

        <div className="text-left bg-zinc-900/30 p-5 border-l-4 border-green-600 mb-8 rounded-r">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold">Status Penebusan:</p>
          <p className="text-sm italic text-zinc-300 leading-relaxed">
            "Denda dibayar. Tapi ingat, uang tidak bisa membeli kembali waktu yang Anda buang. Mulai kerja sekarang atau denda ini hanya akan jadi donasi sia-sia."
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => router.push('/audit')}
            className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-4 transition-all uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(22,163,74,0.2)]"
          >
            Protokol Eksekusi
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-[9px] text-zinc-600 uppercase tracking-widest italic">
            Integrity check active // momentum is fragile.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuditSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <p className="text-primary animate-pulse uppercase tracking-[0.5em] text-xs">Validating_Protocol...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
