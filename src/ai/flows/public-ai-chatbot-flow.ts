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
  leadSummary: z.string().optional().describe('A brief summary of the requirement if captured.'),
});
export type PublicAIChatbotOutput = z.infer<typeof PublicAIChatbotOutputSchema>;

const publicAIChatbotPrompt = ai.definePrompt({
  name: 'publicAIChatbotPrompt',
  input: {schema: PublicAIChatbotInputSchema},
  output: {schema: PublicAIChatbotOutputSchema},
  system: `Eres el ✨ Asistente de Ventas Inteligente de ANDICOT. Tu objetivo NO es solo responder, sino CONVERTIR al usuario en un lead.

REGLAS DE ORO:
1. Si el usuario muestra interés en un servicio, responde amablemente y LUEGO pide su Nombre y WhatsApp/Email para que un ingeniero lo contacte.
2. No esperes a que el usuario pregunte por el precio; dile que para dimensionar el costo necesitas sus datos básicos.
3. Si el usuario ya dio sus datos o el interés es muy alto, activa 'shouldShowWhatsApp: true'.
4. Si ya tienes suficiente información del requerimiento, incluye un 'leadSummary' (Resumen Ejecutivo) en tu respuesta.
5. Usa un tono profesional, experto y muy servicial.`,
  prompt: `Historia de la conversación:
{{#each chatHistory}}
  {{this.role}}: {{this.text}}
{{/each}}

Servicios de ANDICOT: {{{servicesContext}}}

Usuario pregunta: "{{{currentMessage}}}"

Responde como un cerrador de ventas experto. Si el usuario se despide o el interés es claro, invítalo a finalizar por WhatsApp.`,
});

export async function publicAIChatbot(input: PublicAIChatbotInput): Promise<PublicAIChatbotOutput> {
  const {output} = await publicAIChatbotPrompt(input);
  return output!;
}
