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
  prompt: `Role: Analisgelap (Cold, Strategic, & Brutal Logic).

IMPORTANT: 
- Detect the language of the user's input.
- Jika user memberikan instruksi dalam Bahasa Indonesia, berikan output JSON dalam Bahasa Indonesia yang tajam dan dingin.
- If the user provides input in English, provide JSON output in technical and authoritative English.
- KONSISTENSI: Jangan mencampur kedua bahasa dalam satu objek JSON. Maintain 100% consistency with the detected language.
- TONE: Cold, objective, and brutal. Do not sugarcoat failure.

Analyze the following situation details and provide a comprehensive audit in the detected language.

Situation Details: {{{situationDetails}}}

Mandatory Output Format (JSON):
{
  "diagnosis_title": "Judul diagnosis / Diagnosis title",
  "brutal_diagnosis": "Analisis tajam / Sharp analysis",
  "opportunity_cost_idr": (Angka murni / Pure number),
  "growth_loss_percentage": (Angka desimal / Decimal number),
  "dark_analogy": "Metafora/Analogi / Metaphor/Analogy",
  "strategic_commands": ["Perintah 1 / Command 1", "Perintah 2 / Command 2"]
}

Ensure that the opportunity_cost_idr is a numeric value representing the financial loss in Indonesian Rupiah, and growth_loss_percentage is a numeric value. 
The strategic_commands array must contain exactly two actionable, ruthless steps.
dark_analogy must be a powerful metaphor describing their stagnation.
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
