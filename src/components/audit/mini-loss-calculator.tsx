"use client";

import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function MiniLossCalculator() {
  const [income, setIncome] = useState(5000000);
  const [months, setMonths] = useState(1);
  const [result, setResult] = useState(0);

  useEffect(() => {
    // Logic: Income * Months + 10% penalty
    const total = (income * months) * 1.1;
    setResult(total);
  }, [income, months]);

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl max-w-md w-full font-mono shadow-[0_0_50px_-12px_rgba(139,0,0,0.3)] animate-in fade-in zoom-in duration-500">
      <div className="flex items-center gap-2 mb-6 text-primary">
        <AlertCircle size={18} />
        <h3 className="text-xs font-bold uppercase tracking-widest">Kalkulator Kerugian Hidup</h3>
      </div>

      <div className="space-y-6">
        {/* Input Gaji */}
        <div>
          <label className="text-[10px] text-zinc-500 uppercase block mb-2">Target Pendapatan/Bulan (Rp)</label>
          <input 
            type="number" 
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-primary transition-colors text-sm"
          />
        </div>

        {/* Input Waktu */}
        <div>
          <label className="text-[10px] text-zinc-500 uppercase block mb-2">Lama Anda Menunda (Bulan)</label>
          <input 
            type="range" 
            min="1" max="60" 
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-primary"
          />
          <div className="text-right text-xs mt-2 text-zinc-400">{months} Bulan</div>
        </div>

        {/* Output Result */}
        <div className="pt-6 border-t border-zinc-900">
          <div className="text-[10px] text-zinc-500 uppercase mb-1">Total Biaya Penundaan (COI):</div>
          <div className="text-3xl font-black text-white tracking-tighter">
            Rp {result.toLocaleString('id-ID')}
          </div>
          <p className="text-[9px] text-zinc-600 mt-2 leading-tight">
            *Termasuk kehilangan momentum pasar 10% kumulatif.
          </p>
        </div>

        <Link href="/audit" className="block">
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 text-xs uppercase tracking-widest transition-all rounded shadow-lg shadow-primary/20 hover:shadow-primary/40">
            Audit Logika Saya Sekarang
          </button>
        </Link>
      </div>
    </div>
  );
}
