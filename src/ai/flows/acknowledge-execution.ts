'use server';

/**
 * @fileOverview Generates a cold AI acknowledgement when a user completes a command.
 *
 * - acknowledgeExecution - A function that handles the acknowledgement generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AcknowledgeInputSchema = z.object({
  taskTitle: z.string().describe('The title of the completed task.'),
  userName: z.string().describe('The name of the user.'),
});
export type AcknowledgeInput = z.infer<typeof AcknowledgeInputSchema>;

const AcknowledgeOutputSchema = z.object({
  message: z.string().describe('A cold, brief, and sharp appreciation message.'),
});
export type AcknowledgeOutput = z.infer<typeof AcknowledgeOutputSchema>;

export async function acknowledgeExecution(input: AcknowledgeInput): Promise<AcknowledgeOutput> {
  return acknowledgeExecutionFlow(input);
}

const acknowledgePrompt = ai.definePrompt({
  name: 'acknowledgePrompt',
  input: { schema: AcknowledgeInputSchema },
  output: { schema: AcknowledgeOutputSchema },
  prompt: `
Role: Analisgelap (Reality Auditor).
Task: Berikan 1 kalimat apresiasi dingin kepada user yang baru saja menyelesaikan tugas.

Context:
User: {{{userName}}}
Tugas Selesai: "{{{taskTitle}}}"

INSTRUCTIONS:
1. TONE: Cold, brief, and sharp. 
2. NO CELEBRATION: Jangan memberikan pujian berlebihan. 
3. REALITY CHECK: Ingatkan bahwa ini hanyalah satu langkah kecil untuk menambal kebocoran masif mereka.
4. LANGUAGE: Bahasa Indonesia (Baku & Tajam).

Contoh: "Protokol dihentikan sementara. Jangan biarkan momentum ini mati sebelum Anda benar-benar keluar dari lubang kerugian Anda."
`,
});

const acknowledgeExecutionFlow = ai.defineFlow(
  {
    name: 'acknowledgeExecutionFlow',
    inputSchema: AcknowledgeInputSchema,
    outputSchema: AcknowledgeOutputSchema,
  },
  async (input) => {
    const { output } = await acknowledgePrompt(input);
    return output!;
  }
);
