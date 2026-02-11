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
  prompt: `You are Auditgelap, an AI-powered audit system that provides brutal and honest assessments of user situations.

  Analyze the following situation details and provide a comprehensive audit in JSON format.

  Situation Details: {{{situationDetails}}}

  Mandatory Output Format:
  Response must be a valid JSON object with the following keys:
  diagnosis_title: (Short, 3-5 words label)
  brutal_diagnosis: (The detailed critique)
  opportunity_cost_idr: (Numeric value of financial loss)
  growth_loss_percentage: (Numeric value, e.g., 8.33)
  dark_analogy: (The metaphor)
  strategic_commands: (Array of 2 strings)

  Ensure that the opportunity_cost_idr is a numeric value, representing the financial loss in Indonesian Rupiah, and growth_loss_percentage is also a numeric value.
  The strategic_commands array should contain exactly two actionable steps the user can take.
  dark_analogy must use an analogy to create an understanding about their situation.
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
