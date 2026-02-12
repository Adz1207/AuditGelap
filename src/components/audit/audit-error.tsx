"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface AuditErrorProps {
  onRetry: () => void;
}

/**
 * AuditError
 * A high-pressure error overlay that appears when the AI generation fails.
 * Maintains the "Analisgelap" persona by blaming the failure on the user's "ego density".
 */
export function AuditError({ onRetry }: AuditErrorProps) {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-6 font-mono z-[150] backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full border border-primary bg-zinc-950 p-8 shadow-[0_0_30px_rgba(139,0,0,0.2)]"
      >
        <div className="flex items-center gap-3 mb-6 text-primary">
          <AlertTriangle className="w-8 h-8" />
          <h1 className="text-xl font-black tracking-tighter uppercase underline decoration-double">System Overload</h1>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-sm text-zinc-400 leading-relaxed">
            Sistem gagal memproses input Anda. Analisis awal menunjukkan: <span className="text-primary italic">"Densitas delusi dan kebohongan diri terlalu tinggi untuk kapasitas server saat ini."</span>
          </p>
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
            ErrorCode: ERROR_EGO_OVERFLOW_0x404
          </p>
        </div>

        <button 
          onClick={onRetry}
          className="w-full bg-zinc-100 hover:bg-primary hover:text-white text-black font-bold py-3 transition-colors uppercase text-xs tracking-widest"
        >
          Coba Lagi (Dan Kali Ini Jujurlah)
        </button>
      </motion.div>
    </div>
  );
}
