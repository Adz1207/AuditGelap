"use client";

import { type AuditOutput } from '@/ai/flows/generate-audit-and-insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShieldAlert, TrendingDown, Wallet, Target, Info } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface AuditResultsProps {
  data: AuditOutput;
}

export function AuditResults({ data }: AuditResultsProps) {
  const chartData = [
    { name: 'Potensi Maksimal', value: 100, fill: 'hsl(var(--accent))' },
    { name: 'Posisi Anda', value: Math.max(0, 100 - data.growth_loss_percentage), fill: 'hsl(var(--primary))' },
  ];

  const formattedCurrency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(data.opportunity_cost_idr);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Diagnosis */}
      <div className="text-center space-y-4 py-8 border-y border-white/5 bg-white/[0.01]">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-primary">Diagnosis Final</h2>
        <h1 className="text-4xl font-bold tracking-tighter uppercase terminal-text glow-red inline-block px-4 py-2 border border-primary/20">
          {data.diagnosis_title}
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Brutal Diagnosis Card */}
        <Card className="bg-black border-white/10 glow-red">
          <CardHeader className="border-b border-white/5 bg-white/[0.02]">
            <CardTitle className="text-sm font-mono uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary" />
              Critique Core
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-lg font-light leading-relaxed italic text-white/90">
              "{data.brutal_diagnosis}"
            </p>
            <div className="pt-4 border-t border-white/5">
              <span className="text-xs font-mono text-muted-foreground uppercase block mb-1">Analogic Projection:</span>
              <p className="text-sm text-primary font-medium">{data.dark_analogy}</p>
            </div>
          </CardContent>
        </Card>

        {/* Loss Metrics Card */}
        <Card className="bg-black border-white/10">
          <CardHeader className="border-b border-white/5 bg-white/[0.02]">
            <CardTitle className="text-sm font-mono uppercase flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-primary" />
              Financial & Growth Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-mono text-muted-foreground uppercase">Opportunity Cost (IDR)</span>
                <Wallet className="w-4 h-4 text-primary opacity-50" />
              </div>
              <p className="text-4xl font-bold text-primary tracking-tight">
                -{formattedCurrency}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-muted-foreground uppercase">Growth Loss</span>
                <span className="text-sm font-bold text-primary">{data.growth_loss_percentage}%</span>
              </div>
              <Progress value={data.growth_loss_percentage} className="h-2 bg-white/5" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">
                Masa depan yang terbakar sia-sia
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics */}
      <Card className="bg-black border-white/10 overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-white/[0.02]">
          <CardTitle className="text-sm font-mono uppercase flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-primary" />
            Visual Gap Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-10 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="rgba(255,255,255,0.4)" 
                fontSize={12} 
                width={120}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }} 
                contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Strategic Commands */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-accent">Perintah Strategis</h3>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {data.strategic_commands.map((cmd, idx) => (
            <div 
              key={idx} 
              className="p-6 border border-accent/20 bg-accent/[0.02] rounded-lg relative overflow-hidden group hover:bg-accent/[0.05] transition-all cursor-default"
            >
              <div className="absolute top-0 right-0 p-3 text-accent/20 font-mono text-2xl">0{idx + 1}</div>
              <div className="flex gap-4 items-start">
                <Target className="w-6 h-6 text-accent shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4 className="font-bold text-accent uppercase text-xs tracking-widest">Execute Immediately</h4>
                  <p className="text-foreground font-medium leading-relaxed">{cmd}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-center pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-full text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          <Info className="w-3 h-3" />
          Hasil audit bersifat objektif dan didasarkan pada parameter kerugian rata-rata industri.
        </div>
      </div>
    </div>
  );
}