
"use client";

import { motion } from "framer-motion";
import { type AuditOutput } from "@/ai/flows/generate-audit-and-insights";

interface ResultCardProps {
  data: AuditOutput;
}

/**
 * ResultCard
 * A high-contrast, terminal-style summary card designed for social sharing.
 * Visualizes the "Void" of lost potential and financial leakage.
 */
export function ResultCard({ data }: ResultCardProps) {
  const auditId = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  
  // Simulated Integrity Score for the audit based on growth loss vs cost
  // In a real scenario, this would be returned by the AI
  const integrityScore = Math.max(15, 100 - Math.floor(data.growth_loss_percentage * 2));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      id="capture-area" 
      className="w-full max-w-[400px] bg-black p-8 border-2 border-zinc-800 font-mono relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)]"
    >
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 p-2 opacity-10 text-[60px] font-black leading-none select-none pointer-events-none">
        VOID
      </div>

      <div className="border-b border-zinc-800 pb-4 mb-6">
        <h2 className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase">Audit Report: #{auditId}</h2>
        <h1 className="text-white text-xl font-black tracking-tighter italic">AUDITGELAP.AI</h1>
      </div>

      <div className="mb-8">
        <p className="text-zinc-500 text-[10px] uppercase mb-1">Opportunity Cost:</p>
        <p className="text-primary text-4xl font-black tracking-tighter">
          Rp {data.opportunity_cost_idr.toLocaleString('id-ID')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border-l border-zinc-800 pl-3">
          <p className="text-zinc-500 text-[10px] uppercase">Integrity Score:</p>
          <p className="text-white text-xl font-bold">{integrityScore}%</p>
        </div>
        <div className="border-l border-zinc-800 pl-3">
          <p className="text-zinc-500 text-[10px] uppercase">Status:</p>
          <p className="text-primary text-xl font-bold italic underline">ACTIVE_LEAK</p>
        </div>
      </div>

      <div className="bg-zinc-900/50 p-4 border border-zinc-800 mb-6">
        <p className="text-zinc-400 text-[11px] italic leading-relaxed">
          "{data.brutal_diagnosis.length > 120 ? data.brutal_diagnosis.substring(0, 120) + '...' : data.brutal_diagnosis}"
        </p>
      </div>

      <div className="text-center">
        <p className="text-zinc-600 text-[8px] uppercase tracking-widest">
          FACE YOUR REALITY AT: AUDITGELAP.NETLIFY.APP
        </p>
      </div>
    </motion.div>
  );
}
