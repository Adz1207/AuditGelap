"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

interface AuditFormProps {
  onSubmit: (situation: string) => void;
  isLoading: boolean;
}

export function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().length < 20) return;
    onSubmit(value);
  };

  return (
    <Card className="border-white/5 bg-white/[0.02] overflow-hidden">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-4">
            <label className="text-xs font-mono uppercase text-muted-foreground tracking-widest">
              Deskripsi Situasi (Min. 20 Karakter)
            </label>
            <Textarea
              placeholder="Ceritakan penundaan Anda, keraguan karir, atau bisnis yang tidak jalan-jalan... Jadilah sejujur mungkin."
              className="min-h-[150px] bg-black/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all text-foreground resize-none"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="px-6 py-4 bg-white/[0.03] flex justify-between items-center border-t border-white/5">
            <span className="text-[10px] text-muted-foreground font-mono italic">
              AI_SENSITIVITY: EXTREME
            </span>
            <Button 
              type="submit" 
              disabled={isLoading || value.trim().length < 20}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-6 group"
            >
              EXECUTE_AUDIT
              <Play className="ml-2 w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}