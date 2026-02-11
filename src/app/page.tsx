import Link from 'next/link';
import { ArrowRight, ShieldAlert } from "lucide-react";
import { MiniLossCalculator } from '@/components/audit/mini-loss-calculator';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-20 font-mono relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-[-1] opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-[128px]" />
      </div>

      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
        {/* Left Side: Copy */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Label Otoritas */}
          <div className="flex items-center gap-2 text-primary mb-6 border border-primary/30 px-3 py-1 rounded-full text-[10px] tracking-[0.3em] uppercase animate-pulse w-fit">
            <ShieldAlert size={14} />
            Sistem Deteksi Delusi Aktif
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter uppercase leading-none">
            Berhenti Membakar <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900">
              Masa Depan Anda.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="max-w-xl text-muted-foreground text-sm md:text-base mb-10 leading-relaxed">
            Auditgelap membedah prokrastinasi Anda secara brutal dan menghitung harga 
            dari setiap detik yang Anda buang. Siap menghadapi angka kerugian Anda?
          </p>

          {/* CTA Group */}
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
            <Link href="/audit" className="flex-1" prefetch={true}>
              <button className="w-full bg-white text-black font-bold py-4 px-8 rounded flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all duration-300 uppercase text-xs tracking-widest group">
                Mulai Audit Sekarang
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side: Interactive Calculator */}
        <div className="flex-1 flex justify-center lg:justify-end w-full">
          <MiniLossCalculator />
        </div>
      </div>

      {/* Footer Ticker */}
      <div className="fixed bottom-0 w-full border-t border-white/5 bg-black/80 backdrop-blur-md py-2 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee text-[10px] text-muted-foreground uppercase tracking-widest">
          TOTAL OPPORTUNITY COST USER MINGGU INI: RP 1.240.500.000 — JANGAN JADI BAGIAN DARI STATISTIK INI — EKSEKUSI SEKARANG — TOTAL OPPORTUNITY COST USER MINGGU INI: RP 1.240.500.000 — JANGAN JADI BAGIAN DARI STATISTIK INI — EKSEKUSI SEKARANG — 
        </div>
      </div>
    </main>
  );
}
