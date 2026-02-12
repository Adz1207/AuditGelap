
"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, Terminal, CheckCircle2, Globe, ShieldCheck, Lock, RefreshCcw, Loader2 } from 'lucide-react';
import { type AuditOutput } from '@/ai/flows/generate-audit-and-insights';
import TypewriterEffect from '@/components/ui/typewriter-effect';
import { RedemptionCounter } from './redemption-counter';
import { Button } from '@/components/ui/button';
import { BlurredSolution } from './blurred-solution';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AuditResultsProps {
  data: AuditOutput;
  lang: 'Indonesian' | 'English';
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AuditResults({ data, lang, onRefresh, isRefreshing }: AuditResultsProps) {
  const [time, setTime] = useState<string | null>(null);
  const [isResolved, setIsResolved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  const handleUnlockProtocol = () => {
    router.push('/#pricing');
  };

  const langCode = lang === 'Indonesian' ? 'ID' : 'EN';

  return (
    <div className="bg-black text-gray-300 p-6 font-mono border border-white/10 rounded-lg max-w-2xl mx-auto shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Terminal size={20} className="text-primary" />
          <span className="text-xs tracking-widest uppercase font-bold text-muted-foreground">
            System Audit Log // {time || 'INITIALIZING...'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10">
          <Globe size={12} className="text-muted-foreground" />
          {langCode}
        </div>
      </div>

      {/* Main Metric: Redemption Counter */}
      <div className="mb-8">
        <RedemptionCounter initialValue={data.opportunity_cost_idr} isResolved={isResolved} />
      </div>

      {!isResolved && (
        <div className="mb-10 flex flex-col items-center gap-4">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest animate-pulse text-center">
            {data.isLocked 
              ? "Protokol eksekusi terkunci. Sinkronkan denda untuk membuka jalan."
              : "Klik di bawah untuk menghentikan timer kerugian:"}
          </p>
          {data.isLocked ? (
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button 
                onClick={handleUnlockProtocol}
                className="w-full bg-primary text-white hover:bg-primary/90 font-black uppercase text-xs tracking-[0.2em] h-12 transition-all group shadow-[0_0_20px_rgba(139,0,0,0.3)]"
              >
                BUKA PROTOKOL EKSEKUSI
                <Lock size={16} className="ml-2 group-hover:scale-110 transition-transform" />
              </Button>
              
              {onRefresh && (
                <Button 
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  variant="outline"
                  className="w-full border-zinc-800 text-zinc-500 hover:text-white hover:border-white text-[10px] uppercase font-bold h-10 tracking-widest"
                >
                  {isRefreshing ? <Loader2 size={14} className="animate-spin mr-2" /> : <RefreshCcw size={14} className="mr-2" />}
                  Sinkronisasi Status Penebusan
                </Button>
              )}
            </div>
          ) : (
            <Button 
              onClick={() => setIsResolved(true)}
              className="bg-white text-black hover:bg-primary hover:text-white font-black uppercase text-xs tracking-[0.2em] h-12 px-10 transition-all group"
            >
              HENTIKAN KEBOCORAN
              <ShieldCheck size={16} className="ml-2 group-hover:scale-110 transition-transform" />
            </Button>
          )}
        </div>
      )}

      {/* Diagnosis Title */}
      <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic terminal-text">
        <TypewriterEffect text={data.diagnosis_title} speed={0.05} />
      </h2>
      
      <div className="text-sm text-muted-foreground leading-relaxed mb-6 border-l-2 border-primary/50 pl-4 italic">
        "<TypewriterEffect text={data.brutal_diagnosis} speed={0.02} />"
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/[0.02] border border-white/10 p-4 rounded shadow-inner group hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2 text-primary mb-1">
            <AlertTriangle size={16} />
            <span className="text-[10px] uppercase font-bold tracking-wider">Growth Loss</span>
          </div>
          <p className="text-xl font-bold text-white">
            -{data.growth_loss_percentage}%
          </p>
        </div>
        <div className="bg-white/[0.02] border border-white/10 p-4 rounded shadow-inner group hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2 text-primary mb-1">
            <ShieldCheck size={16} />
            <span className="text-[10px] uppercase font-bold tracking-wider">Audit Protocol</span>
          </div>
          <p className="text-xl font-bold text-white uppercase tracking-tighter">
            {data.type}
          </p>
        </div>
      </div>

      {/* Analogy Section */}
      <div className="bg-white/[0.03] p-4 rounded-md mb-8 border-dashed border border-white/10">
        <h3 className="text-[10px] uppercase text-muted-foreground font-bold mb-2">Dark Reality Analogy:</h3>
        <div className="text-sm text-gray-300 leading-relaxed">
          <TypewriterEffect text={data.dark_analogy} speed={0.015} />
        </div>
      </div>

      {/* Commands Wrapper with Blurred Paywall */}
      <BlurredSolution isLocked={data.isLocked} onUnlock={handleUnlockProtocol}>
        <h3 className="text-xs uppercase text-accent font-bold mb-4 flex items-center gap-2">
          <CheckCircle2 size={14} />
          Strategic Commands
        </h3>
        <ul className="space-y-3">
          {data.strategic_commands.map((cmd, index) => (
            <li 
              key={index} 
              className="flex gap-4 text-sm bg-accent/5 border border-accent/10 p-4 rounded group hover:bg-accent/10 transition-all"
            >
              <span className="text-accent font-black">
                [{index + 1}]
              </span>
              <span className="text-gray-300 font-mono">
                {cmd}
              </span>
            </li>
          ))}
        </ul>
      </BlurredSolution>

      {/* Footer Info */}
      <div className="mt-8 pt-4 border-t border-white/10 text-[9px] text-muted-foreground text-center uppercase tracking-[0.2em]">
        Auditgelap Protocol v1.0 // No excuses tolerated.
      </div>
    </div>
  );
}
