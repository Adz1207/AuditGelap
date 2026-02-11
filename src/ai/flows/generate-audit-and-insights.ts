
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
  isPremiumUser: z
    .boolean()
    .optional()
    .default(false)
    .describe('Whether the user has a premium subscription.'),
});
export type AuditInput = z.infer<typeof AuditInputSchema>;

const AuditOutputSchema = z.object({
  diagnosis_title: z
    .string()
    .describe('Short label (3-5 words) for the diagnosis.'),
  brutal_diagnosis: z.string().describe('Detailed critique of the situation.'),
  opportunity_cost_idr: z
    .number()
    .describe('Total Cost of Inaction (COI) in IDR.'),
  growth_loss_percentage: z
    .number()
    .describe('Percentage of productive career lost.'),
  dark_analogy: z.string().describe('A metaphor for the situation.'),
  strategic_commands: z.array(z.string()).describe('Array of strategic commands.'),
  type: z.enum(['standard', 'deep_audit']).describe('The type of audit generated.'),
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
User Premium Status: {{#if isPremiumUser}}PREMIUM{{else}}FREE{{/if}}

Role: Analisgelap (Cold, Strategic, & Brutal Logic).

IMPORTANT TONE GUIDELINES:
- Indonesian: "Tajam dan dingin" (sharp and cold).
- English: "Technical and authoritative".
- consistency: 100% in the selected language.

Calculation Logic:
1. Dream Monthly Income Estimation based on context.
2. Months of stagnation Estimation.
3. Absolute Loss = Dream Income * Months.
4. Momentum Loss = Absolute Loss * 0.1 (Competitive Decay).
5. opportunity_cost_idr = Absolute Loss + Momentum Loss.
6. growth_loss_percentage = (Months / 480) * 100.

HIGH LOSS OVERRIDE (LOSS > 100,000,000 IDR):
- diagnosis_title: "DARURAT LOGIKA: STATUS KRITIS"
- brutal_diagnosis: "Anda sudah membakar [opportunity_cost_idr] dan Anda masih punya keberanian untuk bilang 'nanti'? Ini bukan lagi prokrastinasi, ini adalah sabotase finansial yang disengaja."
- dark_analogy: "Anda seperti orang yang berdiri di dalam rumah yang sedang terbakar, melihat tabungan Anda hangus, tapi Anda sibuk memperdebatkan warna selang air yang ingin Anda beli."
- strategic_commands: ["Hentikan semua alasan.", "Lakukan [ACTION] dalam 60 menit ke depan."]

General Requirements:
- If User is PREMIUM: Provide "deep_audit" with 3-4 commands.
- If User is FREE: Provide "standard" with 2 commands.
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
