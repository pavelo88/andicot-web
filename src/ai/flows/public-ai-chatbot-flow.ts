'use server';
/**
 * @fileOverview An AI chatbot flow that answers user questions about ANDICOT's services
 * and technology ecosystems based on provided context.
 *
 * - publicAIChatbotFlow - A Genkit flow that handles chatbot interactions.
 * - PublicAIChatbotInput - The input type for the publicAIChatbotFlow function.
 * - PublicAIChatbotOutput - The return type for the publicAIChatbotFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PublicAIChatbotInputSchema = z.object({
  chatHistory: z
    .array(z.object({role: z.enum(['user', 'bot']), text: z.string()}))
    .describe('The previous messages in the chat conversation.'),
  currentMessage: z.string().describe('The user\u0027s latest message.'),
  servicesContext: z.string().describe('A string containing details about available services for context.'),
});
export type PublicAIChatbotInput = z.infer<typeof PublicAIChatbotInputSchema>;

const PublicAIChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\u0027s generated response.'),
});
export type PublicAIChatbotOutput = z.infer<typeof PublicAIChatbotOutputSchema>;

export async function publicAIChatbot(input: PublicAIChatbotInput): Promise<PublicAIChatbotOutput> {
  return publicAIChatbotFlow(input);
}

const publicAIChatbotPrompt = ai.definePrompt({
  name: 'publicAIChatbotPrompt',
  input: {schema: PublicAIChatbotInputSchema},
  output: {schema: PublicAIChatbotOutputSchema},
  system: "Eres el \u2728 Asistente Virtual Inteligente de ANDICOT, una prestigiosa empresa ecuatoriana experta en An\u00e1lisis, Dise\u00f1o y Construcci\u00f3n Tecnol\u00f3gica.",
  prompt: `Historia de la conversaci\u00f3n:
{{#each chatHistory}}
  {{this.role}}: {{this.text}}
{{/each}}

Servicios disponibles de la empresa para usar como contexto: {{{servicesContext}}}

Usuario pregunta: "{{{currentMessage}}}"

Responde como un asistente de ventas experto de ANDICOT. Eres conciso, amable y profesional (m\u00e1ximo 2 p\u00e1rrafos cortos).`,
});

const publicAIChatbotFlow = ai.defineFlow(
  {
    name: 'publicAIChatbotFlow',
    inputSchema: PublicAIChatbotInputSchema,
    outputSchema: PublicAIChatbotOutputSchema,
  },
  async input => {
    const {output} = await publicAIChatbotPrompt(input);
    return output!;
  },
);
