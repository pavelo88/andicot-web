'use server';
/**
 * @fileOverview A flow for generating a formal commercial proposal draft based on a lead's requirement.
 *
 * - generateProposal - A function that handles the commercial proposal generation process.
 * - GenerateProposalInput - The input type for the generateProposal function.
 * - GenerateProposalOutput - The return type for the generateProposal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProposalInputSchema = z.object({
  leadMessage: z
    .string()
    .describe("The lead's detailed requirement for which a proposal needs to be generated."),
});
export type GenerateProposalInput = z.infer<typeof GenerateProposalInputSchema>;

const GenerateProposalOutputSchema = z.object({
  proposal: z.string().describe('The generated formal commercial proposal draft.'),
});
export type GenerateProposalOutput = z.infer<typeof GenerateProposalOutputSchema>;

export async function generateProposal(input: GenerateProposalInput): Promise<GenerateProposalOutput> {
  return generateProposalFlow(input);
}

const generateProposalPrompt = ai.definePrompt({
  name: 'generateProposalPrompt',
  input: {schema: GenerateProposalInputSchema},
  output: {schema: GenerateProposalOutputSchema},
  system: 'Eres un experto redactor de propuestas tecnológicas empresariales.',
  prompt: `Actúa como Director de Ingeniería de ANDICOT. Redacta un borrador de PROPUESTA COMERCIAL formal y persuasiva para el requerimiento de este cliente: "{{{leadMessage}}}".\n\nEstructura obligatoria:\n1. Resumen del Requerimiento\n2. Solución Tecnológica Propuesta (detalla qué equipos o servicios recomendarías)\n3. Siguientes Pasos (invitación a reunión o levantamiento técnico).\n\nMantén un tono altamente corporativo, técnico y profesional B2B.`,}
);

const generateProposalFlow = ai.defineFlow(
  {
    name: 'generateProposalFlow',
    inputSchema: GenerateProposalInputSchema,
    outputSchema: GenerateProposalOutputSchema,
  },
  async (input) => {
    const {output} = await generateProposalPrompt(input);
    return output!;
  }
);
