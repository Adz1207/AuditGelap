'use server';

/**
 * @fileOverview Verifies the integrity of a task execution claim.
 *
 * - verifyExecution - A function that handles the verification process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VerifyExecutionInputSchema = z.object({
  taskTitle: z.string().describe('The title of the task being verified.'),
  executionProof: z.string().describe('The user\'s description/proof of what they did.'),
  userName: z.string().describe('The name of the user.'),
});
export type VerifyExecutionInput = z.infer<typeof VerifyExecutionInputSchema>;

const VerifyExecutionOutputSchema = z.object({
  integrity_score: z.number().int().min(0).max(100).describe('Score of the execution integrity.'),
  is_valid: z.boolean().describe('Whether the execution is deemed valid.'),
  analysis: z.string().describe('Brief analysis of why it is valid or bullshit.'),
  resolution_message: z.string().describe('A cold resolution or a brutal roast.'),
});
export type VerifyExecutionOutput = z.infer<typeof VerifyExecutionOutputSchema>;

export async function verifyExecution(input: VerifyExecutionInput): Promise<VerifyExecutionOutput> {
  return verifyExecutionFlow(input);
}

const verifyPrompt = ai.definePrompt({
  name: 'verifyPrompt',
  input: { schema: VerifyExecutionInputSchema },
  output: { schema: VerifyExecutionOutputSchema },
  prompt: `
Role: Analisgelap (Chief of Integrity).
Task: Audit klaim penyelesaian tugas dari user.

Context:
User: {{{userName}}}
Tugas: "{{{taskTitle}}}"
Bukti Eksekusi: "{{{executionProof}}}"

INSTRUCTIONS:
1. KRITERIA VALID: Spesifik, ada detail teknis, menunjukkan progres riil, data-driven.
2. KRITERIA BULLSHIT: Umum ("sudah selesai", "aman"), ambigu, emosional ("saya sudah berusaha", "capek bgt"), atau cuma alasan.
3. TONE: Dingin, skeptis ekstrem, dan tajam.
4. LANGUAGE: Bahasa Indonesia (Baku & Brutal).

Output Logic:
- Jika "Bullshit": is_valid = false, integrity_score < 30, resolution_message = Roasting pedas tentang kemalasan dan kebohongan mereka.
- Jika "Valid": is_valid = true, integrity_score > 70, resolution_message = Pesan dingin yang mengakui langkah kecil mereka tanpa pujian berlebihan.

[OUTPUT_LANGUAGE: Indonesian]
`,
});

const verifyExecutionFlow = ai.defineFlow(
  {
    name: 'verifyExecutionFlow',
    inputSchema: VerifyExecutionInputSchema,
    outputSchema: VerifyExecutionOutputSchema,
  },
  async (input) => {
    const { output } = await verifyPrompt(input);
    return output!;
  }
);
