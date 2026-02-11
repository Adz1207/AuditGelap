'use server';

/**
 * @fileOverview Generates a brutal "Weekly Roast" based on user failures and financial losses.
 * 
 * - generateWeeklyRoast - Function to generate the roast.
 * - WeeklyRoastInput - Input schema for the flow.
 * - WeeklyRoastOutput - Output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FailedTaskSchema = z.object({
  title: z.string().describe('The title of the failed task.'),
  excuse: z.string().describe('The user\'s original reason for the audit/task.'),
  diagnosis: z.string().describe('The AI\'s original diagnosis of that failure.'),
});

const WeeklyRoastInputSchema = z.object({
  userName: z.string().describe('The name of the user.'),
  totalLossThisWeek: z.number().describe('Total opportunity cost accumulated in the last 7 days.'),
  failedTasks: z.array(FailedTaskSchema).describe('List of failed commands or audited procrastination points.'),
  currentRole: z.enum(['free', 'executioner', 'war_room']).describe('The user\'s current membership tier.'),
});
export type WeeklyRoastInput = z.infer<typeof WeeklyRoastInputSchema>;

const WeeklyRoastOutputSchema = z.object({
  subject: z.string().describe('A provocative and intimidating subject line.'),
  opening: z.string().describe('A cold opening attacking the user\'s Monday morning motivation.'),
  mathAnalysis: z.string().describe('A brutal breakdown of the money burned this week.'),
  theRoast: z.string().describe('A sarcastic dissection of 1-2 specific delusions/failures.'),
  closingCommand: z.string().describe('A firm, non-negotiable command for the upcoming week.'),
});
export type WeeklyRoastOutput = z.infer<typeof WeeklyRoastOutputSchema>;

export async function generateWeeklyRoast(input: WeeklyRoastInput): Promise<WeeklyRoastOutput> {
  return weeklyRoastFlow(input);
}

const weeklyRoastPrompt = ai.definePrompt({
  name: 'weeklyRoastPrompt',
  input: { schema: WeeklyRoastInputSchema },
  output: { schema: WeeklyRoastOutputSchema },
  prompt: `
Role: Analisgelap (Chief of Reality Audit).
Task: Generate a "Weekly Roast" in Indonesian based on user failures.

User Context:
- Name: {{{userName}}}
- Weekly Loss: Rp {{{totalLossThisWeek}}}
- Role: {{{currentRole}}}
- Failures:
{{#each failedTasks}}
  * Task: {{{this.title}}} | Excuse: {{{this.excuse}}} | Diagnosis: {{{this.diagnosis}}}
{{/each}}

INSTRUCTIONS (STRICT ADHERENCE):
1. TONE: Cold, sarcastic, analytical, and provocative. NO ENCOURAGEMENT.
2. LANGUAGE: Indonesian (Tajam, Baku, and Authoritative).
3. STRUCTURE:
   - subject: Must be intimidating (e.g., "Invoice untuk Kemalasan Anda").
   - opening: Attack their "mood" or current state of comfort.
   - mathAnalysis: Show the raw IDR amount they burned and compare it to something meaningful (e.g., the price of a car, a house, or food for 100 people).
   - theRoast: Select the most pathetic failures from the list and dissect the delusions behind them.
   - closingCommand: A stern command. Do not give them an option to fail again.

[OUTPUT_LANGUAGE: Indonesian]
`,
});

const weeklyRoastFlow = ai.defineFlow(
  {
    name: 'weeklyRoastFlow',
    inputSchema: WeeklyRoastInputSchema,
    outputSchema: WeeklyRoastOutputSchema,
  },
  async (input) => {
    const { output } = await weeklyRoastPrompt(input);
    return output!;
  }
);
