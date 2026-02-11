"use client";

import { useState } from 'react';
import { AuditForm } from './audit-form';
import { AuditResults } from './audit-results';
import { generateAuditAndInsights, type AuditOutput } from '@/ai/flows/generate-audit-and-insights';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function AuditContainer() {
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState<AuditOutput | null>(null);
  const { toast } = useToast();

  const handleAudit = async (situation: string) => {
    setLoading(true);
    setAuditData(null);
    try {
      const result = await generateAuditAndInsights({ situationDetails: situation });
      setAuditData(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "System Failure",
        description: "Gagal menghubungkan ke modul intelijen AI. Coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <AuditForm onSubmit={handleAudit} isLoading={loading} />
      
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="font-mono text-sm uppercase tracking-widest text-primary animate-pulse">
            Membedah Delusi... Memindai Penyesalan...
          </p>
        </div>
      )}

      {auditData && <AuditResults data={auditData} />}
    </div>
  );
}