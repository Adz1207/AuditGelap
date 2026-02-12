
"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RedemptionCounterProps {
  initialValue: number;
  isResolved: boolean;
  className?: string;
}

/**
 * RedemptionCounter
 * A high-pressure visual component that counts up opportunity cost in real-time.
 * When resolved, it plays a grayscale "redemption" animation.
 */
export function RedemptionCounter({ initialValue, isResolved, className }: RedemptionCounterProps) {
  const [count, setCount] = useState(initialValue);
  const controls = useAnimation();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isResolved) {
      // Counter continues running every second to simulate ongoing opportunity cost
      interval = setInterval(() => {
        setCount((prev) => prev + 100); 
      }, 1000);
    } else {
      // When Resolved: Run the "Redemption" protocol animation
      controls.start({
        color: "#4b5563", // Gray-600
        scale: [1, 1.05, 1],
        filter: "grayscale(100%)",
        transition: { duration: 1.5, ease: "easeOut" }
      });
      if (interval!) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResolved, controls]);

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 border border-white/10 bg-black/60 rounded-xl shadow-[0_0_50px_-12px_rgba(139,0,0,0.2)]", className)}>
      <motion.h2 
        className="text-[10px] tracking-[0.5em] text-zinc-500 uppercase mb-4 font-bold"
        animate={isResolved ? { opacity: 0.5 } : { opacity: 1 }}
      >
        {isResolved ? "PROTOKOL DIHENTIKAN" : "KERUGIAN BERJALAN (IDR)"}
      </motion.h2>

      <motion.div
        animate={controls}
        className={`text-4xl md:text-6xl font-mono font-black tabular-nums tracking-tighter ${isResolved ? 'text-zinc-600' : 'text-primary'}`}
        style={{ textShadow: !isResolved ? "0 0 30px rgba(139, 0, 0, 0.4)" : "none" }}
      >
        Rp {count.toLocaleString("id-ID")}
      </motion.div>

      {isResolved && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-2 text-center"
        >
          <p className="text-[10px] italic text-zinc-500 border-t border-white/5 pt-4 leading-relaxed max-w-sm">
            "Satu api padam. Jangan biarkan sisa rumah Anda hangus karena rasa puas yang prematur."
          </p>
          <div className="text-[8px] text-primary/50 font-bold uppercase tracking-widest">
            STATUS: REDEMPTION_ACTIVE
          </div>
        </motion.div>
      )}
    </div>
  );
}
