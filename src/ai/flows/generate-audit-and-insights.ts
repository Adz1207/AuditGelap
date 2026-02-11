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
    .describe('Numeric value of financial loss in Indonesian Rupiah.'),
  growth_loss_percentage: z
    .number()
    .describe('Numeric value of growth loss, e.g., 8.33.'),
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
- TONE: Cold, objective, and brutal. Do not sugarcoat failure.

Analysis Requirements:
1. Diagnosis Title: A technical name for their failure (e.g., "Intellectual Stagnation Trap", "Sistem Delusi Linear").
2. Brutal Diagnosis: Analyze why their current path is leading to a systemic crash. Focus on consumption vs production, procrastination, or fear.
3. Opportunity Cost: Estimate the financial loss in IDR (Indonesian Rupiah) based on typical industry rates or missed earnings.
4. Growth Loss: Calculate a realistic but alarming percentage of potential growth lost.
5. Dark Analogy: A powerful, grim metaphor for their stagnation (e.g., "You are a library patron trying to learn surgery by reading books while the patient is dying on the table").
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
