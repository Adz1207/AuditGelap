'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * LiveStatFooter
 * A global intelligence feed that broadcasts live audit losses and redemption signals.
 * Designed to provide constant atmospheric pressure and a sense of shared reality.
 */
export const LiveStatFooter = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-zinc-900 font-mono py-2 overflow-hidden z-[100]">
      <div className="flex whitespace-nowrap">
        {/* Marquee Effect using Framer Motion for smoother cross-browser behavior */}
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 text-[10px] uppercase tracking-widest text-zinc-500"
        >
          <div className="flex gap-12 items-center">
            <span className="flex gap-2 items-center">
              <span className="text-primary font-bold">[ LIVE AUDIT ]</span> 
              USER_ID_8829 BARU SAJA KEHILANGAN <span className="text-white">RP 45.000.000</span> AKIBAT PENUNDAAN
            </span>
            <span className="flex gap-2 items-center">
              <span className="text-zinc-700">//</span> 
              TOTAL OPPORTUNITY COST GLOBAL: <span className="text-white">RP 12.482.900.500</span>
            </span>
            <span className="flex gap-2 items-center">
              <span className="text-accent font-bold">[ REDEMPTION ]</span> 
              USER_ID_1022 TELAH MEMBAYAR DENDA DAN MEMULAI EKSEKUSI
            </span>
            <span className="flex gap-2 items-center">
              <span className="text-zinc-700">//</span> 
              INTEGRITY RATE RATA-RATA: <span className="text-primary">12.4%</span>
            </span>
            <span className="flex gap-2 items-center">
              <span className="text-primary font-bold">[ SYSTEM_ALERT ]</span> 
              543 AUDIT AKTIF SEDANG MENDETEKSI LOGIC_FALLACY
            </span>
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex gap-12 items-center">
            <span className="flex gap-2 items-center">
              <span className="text-primary font-bold">[ LIVE AUDIT ]</span> 
              USER_ID_8829 BARU SAJA KEHILANGAN <span className="text-white">RP 45.000.000</span> AKIBAT PENUNDAAN
            </span>
            <span className="flex gap-2 items-center">
              <span className="text-zinc-700">//</span> 
              TOTAL OPPORTUNITY COST GLOBAL: <span className="text-white">RP 12.482.900.500</span>
            </span>
            <span className="flex gap-2 items-center">
              <span className="text-accent font-bold">[ REDEMPTION ]</span> 
              USER_ID_1022 TELAH MEMBAYAR DENDA DAN MEMULAI EKSEKUSI
            </span>
            <span className="flex gap-2 items-center">
              <span className="text-zinc-700">//</span> 
              INTEGRITY RATE RATA-RATA: <span className="text-primary">12.4%</span>
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
