"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlurredSolutionProps {
  isLocked: boolean;
  children: React.ReactNode;
  onUnlock: () => void;
}

/**
 * BlurredSolution
 * Visually masks sensitive strategic data behind a paywall effect.
 * Uses a combination of CSS blur and a high-pressure overlay for non-premium users.
 */
export const BlurredSolution = ({ isLocked, children, onUnlock }: BlurredSolutionProps) => {
  return (
    <div className="relative mt-12 border border-zinc-800 bg-zinc-950 overflow-hidden rounded-lg">
      {/* Header Area */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
        <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase font-bold">
          [ STRATEGIC COMMANDS // ENCRYPTED ]
        </span>
        {isLocked && (
          <span className="text-[10px] bg-primary/20 text-primary px-3 py-1 border border-primary/50 animate-pulse font-black uppercase">
            LOCKED
          </span>
        )}
      </div>

      <div className="relative p-6 min-h-[200px]">
        {/* Content with conditional blur */}
        <div className={cn(
          "transition-all duration-700",
          isLocked ? "select-none blur-xl opacity-20 pointer-events-none" : "opacity-100"
        )}>
          {children}
        </div>

        {/* Paywall Overlay */}
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] p-8 text-center"
          >
            <div className="max-w-xs space-y-6">
              <div className="inline-block p-3 rounded-full bg-primary/10 border border-primary/30 text-primary">
                <Lock size={24} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white tracking-tighter uppercase italic">SOLUSI TERKUNCI</h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed font-mono uppercase">
                  Sistem tidak akan memberikan langkah strategis kepada orang yang bahkan tidak mau membayar denda atas waktu yang ia buang sendiri.
                </p>
              </div>

              <button 
                onClick={onUnlock}
                className="w-full py-4 bg-primary hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(139,0,0,0.4)] group flex items-center justify-center gap-2"
              >
                Unlock Protocol (IDR 250k)
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </button>
              
              <p className="text-[8px] text-zinc-600 italic uppercase tracking-widest">
                *Pembayaran diproses melalui Midtrans Secure Gateway
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
