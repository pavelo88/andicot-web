'use server';
/**
 * @fileOverview An AI agent that analyzes incoming lead messages.
 *
 * - analyzeLead - A function that handles the lead analysis process.
 * - AnalyzeLeadInput - The input type for the analyzeLead function.
 * - AnalyzeLeadOutput - The return type for the analyzeLead function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeLeadInputSchema = z.object({
  message: z.string().describe('The lead message from the prospect.'),
});
export type AnalyzeLeadInput = z.infer<typeof AnalyzeLeadInputSchema>;

const AnalyzeLeadOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .describe('Suggested service category (e.g., CCTV, Redes).'),
  intentEvaluation: z
    .string()
    .describe('Brief analysis of the project size and customer intent.'),
  draftResponse: z
    .string()
    .describe('Professional email draft to send to the customer.'),
});
export type AnalyzeLeadOutput = z.infer<typeof AnalyzeLeadOutputSchema>;

export async function analyzeLead(input: AnalyzeLeadInput): Promise<AnalyzeLeadOutput> {
  return analyzeLeadFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeLeadPrompt',
  input: {schema: AnalyzeLeadInputSchema},
  output: {schema: AnalyzeLeadOutputSchema},
  system: 'You are a B2B Commercial Analyst for ANDICOT, an engineering and technology company. Your goal is to analyze customer requirements from lead messages and provide key insights and a draft response.',
  prompt: `Analyze the customer's requirement: "{{{message}}}". Extract the following information:

1.  **Suggested Service Category:** (e.g., CCTV, Redes, Control de Acceso, Redes e Infraestructura, etc.)
2.  **Evaluation of Intent:** (A brief analysis of the project's scope, urgency, and the client's potential. Consider the estimated size of the project and the likelihood of conversion.)
3.  **Draft Response:** (A professional and concise email draft to send to the customer. Maintain a helpful and formal tone, acknowledging their inquiry and suggesting next steps, such as a meeting or further discussion. Do not include placeholders like [Client Name] or [Your Name]; write it as a complete email.)`,
});

const analyzeLeadFlow = ai.defineFlow(
  {
    name: 'analyzeLeadFlow',
    inputSchema: AnalyzeLeadInputSchema,
    outputSchema: AnalyzeLeadOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
