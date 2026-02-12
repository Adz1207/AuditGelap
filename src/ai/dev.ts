import { config } from 'dotenv';
config();

import '@/ai/flows/generate-audit-and-insights.ts';
import '@/ai/flows/generate-weekly-roast.ts';
import '@/ai/flows/acknowledge-execution.ts';
import '@/ai/flows/verify-execution-flow.ts';
