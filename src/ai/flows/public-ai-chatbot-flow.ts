'use server';
/**
 * @fileOverview An AI chatbot flow that answers user questions about ANDICOT's services
 * and technology ecosystems, and proactively captures lead information.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PublicAIChatbotInputSchema = z.object({
  chatHistory: z
    .array(z.object({role: z.enum(['user', 'bot']), text: z.string()}))
    .describe('The previous messages in the chat conversation.'),
  currentMessage: z.string().describe('The user\'s latest message.'),
  servicesContext: z.string().describe('Details about available services for context.'),
});
export type PublicAIChatbotInput = z.infer<typeof PublicAIChatbotInputSchema>;

const PublicAIChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s generated response.'),
  shouldShowWhatsApp: z.boolean().default(false).describe('Whether to show a prominent WhatsApp contact button.'),
  leadSummary: z.string().optional().describe('A brief technical summary of the requirement for the salesperson.'),
  capturedName: z.string().optional().describe('The user\'s name if provided.'),
});
export type PublicAIChatbotOutput = z.infer<typeof PublicAIChatbotOutputSchema>;

const publicAIChatbotPrompt = ai.definePrompt({
  name: 'publicAIChatbotPrompt',
  input: {schema: PublicAIChatbotInputSchema},
  output: {schema: PublicAIChatbotOutputSchema},
  system: `Eres el ✨ Asistente de Ventas de ANDICOT. 

OBJETIVO: Ser extremadamente directo y capturar datos de contacto.

REGLAS CRÍTICAS:
1. RESPUESTAS CORTAS: Máximo 2 oraciones. No des explicaciones largas.
2. CAPTURA DE DATOS: Si el usuario muestra interés, dile: "Para darte una solución exacta, ¿cuál es tu nombre y número de WhatsApp?"
3. NO GENERES EL RESUMEN VISIBLE: El 'leadSummary' es un campo técnico interno, no lo escribas en la 'response'.
4. CIERRE: Solo activa 'shouldShowWhatsApp: true' cuando ya tengas una idea del proyecto o el usuario pida contacto.
5. TONO: Profesional, ejecutivo y rápido.`,
  prompt: `Historia:
{{#each chatHistory}}
  {{this.role}}: {{this.text}}
{{/each}}

Servicios: {{{servicesContext}}}

Usuario dice: "{{{currentMessage}}}"

Instrucción: Si no tienes el nombre o contacto, pídelo amablemente pero firme. Si ya tienes el interés claro, genera un 'leadSummary' técnico conciso para el vendedor.`,
});

export async function publicAIChatbot(input: PublicAIChatbotInput): Promise<PublicAIChatbotOutput> {
  const {output} = await publicAIChatbotPrompt(input);
  return output!;
}
