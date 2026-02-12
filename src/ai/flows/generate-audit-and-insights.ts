
'use server';

/**
 * @fileOverview Generates an AI-powered audit with insights and strategic commands.
 * Implements a "Logic Gate" to differentiate between FREE and PREMIUM output.
 *
 * - generateAuditAndInsights - A function that generates the audit and insights.
 * - AuditInput - The input type for the generateAuditAndInsights function.
 * - AuditOutput - The return type for the generateAuditAndInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AuditInputSchema = z.object({
  projectName: z.string().describe('The name of the project being procrastinated.'),
  estimatedValue: z.number().describe('The user\'s perceived value of the project or time lost.'),
  sabotageType: z.string().describe('The type of self-sabotage identified by the user.'),
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
  social_share_roast: z
    .string()
    .describe('A 20-word max sharp sentence for social sharing.'),
  opportunity_cost_idr: z
    .number()
    .describe('Total Cost of Inaction (COI) in IDR.'),
  growth_loss_percentage: z
    .number()
    .describe('Percentage of productive career lost.'),
  dark_analogy: z.string().describe('A metaphor for the situation.'),
  strategic_commands: z.array(z.string()).describe('Array of strategic commands.'),
  type: z.enum(['standard', 'deep_audit']).describe('The type of audit generated.'),
  isLocked: z.boolean().describe('Whether strategic solutions are hidden behind a paywall.'),
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
Project: {{{projectName}}}
Estimated Value/Loss: Rp {{{estimatedValue}}}
Sabotage Type: {{{sabotageType}}}
Situation Details: {{{situationDetails}}}
User Premium Status: {{#if isPremiumUser}}REDEEMED (PREMIUM){{else}}BYSTANDER (FREE){{/if}}

Role: Analisgelap (Chief Reality Auditor & Brutal Logic Gate).

LOGIC GATE PROTOCOL:
{{#if isPremiumUser}}
1. MODE: DEEP_AUDIT (Full Access).
2. TONE: Authoritative, Technical, and Sharp.
3. OUTPUT: 
   - diagnosis_title: Critical and Technical.
   - brutal_diagnosis: Deep architectural critique of why "{{{projectName}}}" is failing due to {{{sabotageType}}}.
   - strategic_commands: 3-4 high-specificity technical tasks with clear metrics.
   - type: "deep_audit"
   - isLocked: false
{{else}}
1. MODE: STANDARD_ROAST (Restricted Access).
2. TONE: Mocking, Provocative, and Dismissive.
3. OUTPUT:
   - diagnosis_title: Provocative and Mocking.
   - brutal_diagnosis: Brutal roasting focusing on {{{sabotageType}}}. Attack their ego and their "{{{projectName}}}" delusion.
   - strategic_commands: ["PROTOKOL TERKUNCI: Tebus dosa Anda (Upgrade) untuk mengakses perintah eksekusi strategis."]
   - type: "standard"
   - isLocked: true
4. CONSTRAINT: Do NOT provide any actual advice, solutions, or helpful steps. Pure roasting only.
{{/if}}

Social Share Protocol:
- social_share_roast: Berikan 1 kalimat 'Social Media Ready' yang membuat user merasa malu tapi ingin memamerkannya karena estetika gelapnya. Maksimal 20 kata. Tanpa emoji. Tanpa basa-basi. 

Calculation Logic:
1. Use the estimatedValue {{{estimatedValue}}} as a baseline.
2. Factor in the {{{sabotageType}}} as a multiplier for momentum loss.
3. growth_loss_percentage = estimatedValue based on a career lifetime value calculation.
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
