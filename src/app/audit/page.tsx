import { AuditContainer } from '@/components/audit/audit-container';
import { ActiveCommandsList } from '@/components/audit/active-commands-list';
import { CommandAuditSystem } from '@/components/audit/command-audit-system';
import { AuditHistory } from '@/components/audit/audit-history';
import { WeeklyAuditReport } from '@/components/audit/weekly-audit-report';

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-12 px-6">
      <CommandAuditSystem />
      
      <div className="max-w-4xl w-full">
        <header className="mb-12 border-l-4 border-primary pl-6 py-2">
          <h1 className="text-3xl font-bold tracking-tight uppercase terminal-text">
            Interface Audit Gelap v1.0
          </h1>
          <p className="text-muted-foreground text-sm font-mono mt-1 uppercase tracking-wider">
            Masukkan parameter situasi Anda untuk analisis kegagalan sistemik.
          </p>
        </header>

        <AuditContainer />
        
        <WeeklyAuditReport />
        
        <ActiveCommandsList />
        
        <AuditHistory />
      </div>
    </div>
  );
}
