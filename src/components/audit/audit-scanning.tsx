
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";

/**
 * AuditScanning
 * A high-fidelity terminal takeover animation that visualizes the AI's "ego-scanning" process.
 * Implements high-pressure visual cues and sequential process logs.
 */
export const AuditScanning = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const processSteps = [
    "UPLOADING GUILT_DATA...",
    "ANALYZING LOGIC_FALLACIES...",
    "CALCULATING OPPORTUNITY_COST...",
    "FETCHING SHADOW_SELF_RECORDS...",
    "GENERATING BRUTAL_TRUTH..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        if (prev.length < processSteps.length) {
          return [...prev, processSteps[prev.length]];
        }
        return prev;
      });
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center font-mono z-[100] p-6 backdrop-blur-md">
      <div className="w-full max-w-sm relative">
        {/* Scanning Line Effect */}
        <motion.div 
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="absolute left-[-20%] right-[-20%] h-[1px] bg-primary shadow-[0_0_15px_rgba(139,0,0,0.8)] z-10 pointer-events-none"
        />

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 rounded-full mb-4">
             <Terminal size={14} className="text-primary animate-pulse" />
             <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">
               Reality Auditor Active
             </span>
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2 italic">
            MENGULITI DELUSI ANDA...
          </h2>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">
            <span>Progress: Audit_In_Depth</span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Scanning...
            </motion.span>
          </div>
          <div className="h-1 w-full bg-zinc-900 border border-white/5 overflow-hidden rounded-full">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 4.5, ease: "easeInOut" }}
              className="h-full bg-primary shadow-[0_0_10px_rgba(139,0,0,0.5)]"
            />
          </div>
        </div>

        <div className="space-y-2 bg-zinc-950/50 p-4 border border-white/5 rounded-lg min-h-[140px]">
          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-primary text-[10px] uppercase tracking-wider font-bold flex items-center gap-2"
              >
                <span className="opacity-50">[{i}]</span>
                <span className="animate-cursor">{log}</span>
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-[8px] text-zinc-700 uppercase tracking-[0.4em] font-black">
            Integritas Data Terjamin // Tidak Ada Jalur Keluar
          </p>
        </div>
      </div>
    </div>
  );
};
