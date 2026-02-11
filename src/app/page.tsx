import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Skull, ShieldAlert, Zap, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative px-6 py-20">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-[-1] opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-[128px]" />
      </div>

      <div className="max-w-4xl w-full space-y-24">
        {/* Exposition (The Hook) */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase">
            <Skull className="w-3 h-3" />
            Warning: High Reality Density
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none terminal-text">
            SETIAP ALASAN YANG ANDA BUAT HARI INI MEMILIKI LABEL HARGA.
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-light">
            [EXPOSITION_HOOK_LOADED]
          </p>
        </section>

        {/* Rising Action (The Tension) */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              Anda pikir menunda satu bulan itu gratis?
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Anda sedang membakar waktu yang tidak akan pernah kembali, sementara inflasi kompetensi di luar sana terus meningkat.
              </p>
              <div className="flex items-center gap-3 text-foreground font-semibold">
                <ShieldAlert className="w-5 h-5 text-primary" />
                <span>KEHILANGAN_KESEMPATAN_TERDETEKSI</span>
              </div>
            </div>
          </div>
          <div className="border border-white/5 bg-white/[0.02] p-8 rounded-lg glow-red relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 text-[10px] text-primary/40 font-mono">STAGNATION_CORE_v1.0</div>
            <div className="space-y-4">
              <div className="h-2 w-3/4 bg-primary/20 rounded" />
              <div className="h-2 w-full bg-primary/20 rounded" />
              <div className="h-2 w-1/2 bg-primary/20 rounded" />
              <div className="pt-4 flex justify-between items-end">
                <span className="text-2xl font-bold text-primary">98%</span>
                <span className="text-xs text-muted-foreground uppercase">Rate of Regret</span>
              </div>
            </div>
          </div>
        </section>

        {/* Climax (The Solution) */}
        <section className="text-center space-y-8 py-12 border-y border-white/5">
          <h2 className="text-4xl md:text-6xl font-bold terminal-text uppercase italic">
            Auditgelap.
          </h2>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-light">
            Sistem audit bertenaga AI yang membedah delusi Anda menjadi angka kerugian riil.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-accent">
              <Zap className="w-4 h-4" />
              GENKIT_ENGINE
            </div>
            <div className="flex items-center gap-2 text-sm text-accent">
              <BarChart3 className="w-4 h-4" />
              BRUTAL_DIAGNOSIS
            </div>
          </div>
        </section>

        {/* Falling Action (The Benefit) */}
        <section className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="p-6 border border-white/5 bg-white/[0.01] rounded-lg space-y-4">
            <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary mb-2">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold uppercase text-foreground">Diagnosis Brutal</h3>
            <p className="text-muted-foreground">Kupas tuntas zona nyaman Anda tanpa filter diplomatis.</p>
          </div>
          <div className="p-6 border border-white/5 bg-white/[0.01] rounded-lg space-y-4">
            <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary mb-2">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold uppercase text-foreground">Kalkulasi Kerugian</h3>
            <p className="text-muted-foreground">Hitung tepat berapa Rupiah yang hangus akibat inaksi Anda.</p>
          </div>
          <div className="p-6 border border-white/5 bg-white/[0.01] rounded-lg space-y-4">
            <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary mb-2">
              <ArrowRight className="w-5 h-5" />
            </div>
            <h3 className="font-bold uppercase text-foreground">Perintah Strategis</h3>
            <p className="text-muted-foreground">Langkah taktis instan untuk berhenti stagnan sekarang juga.</p>
          </div>
        </section>

        {/* Resolution (The CTA) */}
        <section className="text-center space-y-8 pb-12">
          <h2 className="text-3xl font-bold text-foreground">Hadapi kenyataan sekarang.</h2>
          <Link href="/audit" prefetch={true}>
            <Button size="lg" className="bg-primary hover:bg-primary/80 text-white font-bold py-8 px-12 text-xl group transition-all glow-red border-none">
              MULAI AUDIT GRATIS
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em]">
            SYSTEM_ID: AUDITGELAP-PRO-9002 // DATA_PRIVATE_ENCRYPTED
          </p>
        </section>
      </div>
    </main>
  );
}