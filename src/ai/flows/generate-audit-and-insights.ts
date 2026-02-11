'use server';

/**
 * @fileOverview Generates an AI-powered audit with insights and strategic commands.
 *
 * - generateAuditAndInsights - A function that generates the audit and insights.
 * - AuditInput - The input type for the generateAuditAndInsights function.
 * - AuditOutput - The return type for the generateAuditAndInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AuditInputSchema = z.object({
  situationDetails: z
    .string()
    .describe('Detailed description of the user\'s current situation.'),
  langPreference: z
    .enum(['Indonesian', 'English'])
    .describe('The preferred language for the output.'),
});
export type AuditInput = z.infer<typeof AuditInputSchema>;

const AuditOutputSchema = z.object({
  diagnosis_title: z
    .string()
    .describe('Short label (3-5 words) for the diagnosis.'),
  brutal_diagnosis: z.string().describe('Detailed critique of the situation.'),
  opportunity_cost_idr: z
    .number()
    .describe('Total Cost of Inaction (COI) in IDR. Formula: (Dream Income * Months Delayed) * 1.1'),
  growth_loss_percentage: z
    .number()
    .describe('Percentage of productive career lost. Formula: (Months Delayed / 480) * 100'),
  dark_analogy: z.string().describe('A metaphor for the situation.'),
  strategic_commands: z.array(z.string()).describe('Array of 2 strategic commands.'),
});
export type AuditOutput = z.infer<typeof AuditOutputSchema>;

export async function generateAuditAndInsights(input: AuditInput): Promise<AuditOutput> {
  return generateAuditAndInsightsFlow(input);
}

const auditPrompt = ai.definePrompt({
  name: 'auditPrompt',
  input: {schema: AuditInputSchema},
  output: {schema: AuditOutputSchema},
  prompt: `[OUTPUT_LANGUAGE: {{{langPreference}}}] 
User Input: {{{situationDetails}}}

Role: Analisgelap (Cold, Strategic, & Brutal Logic).

IMPORTANT TONE GUIDELINES:
- If [OUTPUT_LANGUAGE] is Indonesian: Provide output that is "tajam dan dingin" (sharp and cold). Use formal yet cutting vocabulary.
- If [OUTPUT_LANGUAGE] is English: Provide output that is "technical and authoritative". Use high-level strategic terminology.
- KONSISTENSI: Jangan mencampur kedua bahasa dalam satu objek JSON. Maintain 100% consistency with the selected [OUTPUT_LANGUAGE].

Calculation Logic (CRITICAL):
Based on the user's situation, estimate their 'Dream Monthly Income' and 'Duration of Stagnation (Months)'. 
1. Absolute Loss = Dream Income * Months.
2. Momentum Loss = Absolute Loss * 0.1 (Momentum decay).
3. opportunity_cost_idr = Absolute Loss + Momentum Loss.
4. growth_loss_percentage = (Months / 480) * 100. (480 months = 40 years productive life).

HIGH LOSS OVERRIDE (CRITICAL):
If the calculated opportunity_cost_idr > 100,000,000 IDR, you MUST use the following structure (translated if [OUTPUT_LANGUAGE] is English):
1. diagnosis_title: "DARURAT LOGIKA: STATUS KRITIS"
2. brutal_diagnosis: "Anda sudah membakar [opportunity_cost_idr] dan Anda masih punya keberanian untuk bilang 'nanti'? Ini bukan lagi prokrastinasi, ini adalah sabotase finansial yang disengaja."
3. dark_analogy: "Anda seperti orang yang berdiri di dalam rumah yang sedang terbakar, melihat tabungan Anda hangus, tapi Anda sibuk memperdebatkan warna selang air yang ingin Anda beli."
4. strategic_commands: ["Hentikan semua alasan.", "Lakukan [ACTION_STEP] dalam 60 menit ke depan atau hapus aplikasi ini karena Anda tidak bisa diselamatkan."]

Analysis Requirements (General):
1. Diagnosis Title: A technical name for their failure.
2. Brutal Diagnosis: Analyze why their current path is leading to a systemic crash. Focus on consumption vs production, procrastination, or fear.
3. Opportunity Cost: Use the calculation logic above to provide a realistic but alarming IDR value.
4. Growth Loss: Use the calculation logic above (career percentage lost).
5. Dark Analogy: A powerful, grim metaphor for their stagnation.
6. Strategic Commands: Exactly 2 ruthless, actionable commands.

Mandatory Output Format (JSON):
{
  "diagnosis_title": "...",
  "brutal_diagnosis": "...",
  "opportunity_cost_idr": (number),
  "growth_loss_percentage": (number),
  "dark_analogy": "...",
  "strategic_commands": ["...", "..."]
}
`,
});

const generateAuditAndInsightsFlow = ai.defineFlow(
  {
    name: 'generateAuditAndInsightsFlow',
    inputSchema: AuditInputSchema,
    outputSchema: AuditOutputSchema,
  },
  async input => {
    const {output} = await auditPrompt(input);
    return output!;
  }
);
