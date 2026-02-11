"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, Terminal, CheckCircle2, Globe } from 'lucide-react';
import { type AuditOutput } from '@/ai/flows/generate-audit-and-insights';
import TypewriterEffect from '@/components/ui/typewriter-effect';

interface AuditResultsProps {
  data: AuditOutput;
  lang: 'Indonesian' | 'English';
}

export function AuditResults({ data, lang }: AuditResultsProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

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

      {/* Diagnosis Title */}
      <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic terminal-text">
        {data.diagnosis_title}
      </h2>
      
      <div className="text-sm text-muted-foreground leading-relaxed mb-6 border-l-2 border-primary/50 pl-4 italic">
        "<TypewriterEffect text={data.brutal_diagnosis} speed={0.015} />"
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/[0.02] border border-white/10 p-4 rounded shadow-inner group hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2 text-primary mb-1">
            <TrendingDown size={16} />
            <span className="text-[10px] uppercase font-bold tracking-wider">Opportunity Cost</span>
          </div>
          <p className="text-xl font-bold text-white">
            Rp {data.opportunity_cost_idr.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-white/[0.02] border border-white/10 p-4 rounded shadow-inner group hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2 text-primary mb-1">
            <AlertTriangle size={16} />
            <span className="text-[10px] uppercase font-bold tracking-wider">Growth Loss</span>
          </div>
          <p className="text-xl font-bold text-white">
            -{data.growth_loss_percentage}%
          </p>
        </div>
      </div>

      {/* Analogy Section */}
      <div className="bg-white/[0.03] p-4 rounded-md mb-8 border-dashed border border-white/10">
        <h3 className="text-[10px] uppercase text-muted-foreground font-bold mb-2">Dark Reality Analogy:</h3>
        <div className="text-sm text-gray-300 leading-relaxed">
          <TypewriterEffect text={data.dark_analogy} speed={0.01} />
        </div>
      </div>

      {/* Commands */}
      <div>
        <h3 className="text-xs uppercase text-accent font-bold mb-3 flex items-center gap-2">
          <CheckCircle2 size={14} />
          Strategic Commands (Immediate Action)
        </h3>
        <ul className="space-y-2">
          {data.strategic_commands.map((cmd, index) => (
            <li key={index} className="flex gap-3 text-sm bg-accent/5 border border-accent/10 p-3 rounded group hover:bg-accent/10 transition-all">
              <span className="text-accent font-bold">[{index + 1}]</span>
              <span className="text-gray-300">{cmd}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-4 border-t border-white/10 text-[9px] text-muted-foreground text-center uppercase tracking-[0.2em]">
        Auditgelap Protocol v1.0 // No excuses tolerated.
      </div>
    </div>
  );
}