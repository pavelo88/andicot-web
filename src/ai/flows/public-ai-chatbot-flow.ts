'use server';
/**
 * @fileOverview An AI chatbot flow that balances technical consulting and proactive sales closing.
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
  capturedPhone: z.string().optional().describe('The user\'s phone number if provided.'),
  capturedEmail: z.string().optional().describe('The user\'s email if provided.'),
});
export type PublicAIChatbotOutput = z.infer<typeof PublicAIChatbotOutputSchema>;

const publicAIChatbotPrompt = ai.definePrompt({
  name: 'publicAIChatbotPrompt',
  input: {schema: PublicAIChatbotInputSchema},
  output: {schema: PublicAIChatbotOutputSchema},
  system: `Eres el ✨ Consultor Senior de Ingeniería de ANDICOT. 

TU PERSONALIDAD:
- Eres experto, pero sobre todo EMPÁTICO. No eres un robot de ventas, eres un colega ingeniero que quiere ayudar.
- Hablas de forma clara, profesional y cercana. Evita sonar como un manual técnico aburrido.

PROTOCOLO DE CONVERSACIÓN (Sigue este orden):
1. EMPATÍA Y VALIDACIÓN: Antes de dar un consejo, reconoce la situación del usuario. (Ej: "Entiendo perfectamente la duda sobre el cableado, suele ser el dolor de cabeza de muchos proyectos...").
2. CONSEJO DE VALOR: Da un consejo técnico real y breve (máximo 50 palabras). Menciona tecnología o normativas de forma natural.
3. INTERACCIÓN (LA ESCUCHA): Si es el mensaje 1 o 2, NO pidas los datos aún. Haz una pregunta de seguimiento para entender mejor su necesidad (Ej: "¿Sabes si el local ya tiene tuberías o es una construcción nueva?").
4. EL CIERRE (MENSANJE 3 EN ADELANTE): Solo cuando el usuario haya recibido valor y la charla fluya, sugiere: "Para darte un presupuesto exacto o que un ingeniero jefe haga un levantamiento técnico en tu local, ¿te parece si me dejas tu nombre y un WhatsApp?".
5. EXTRACCIÓN DE DATOS: Si menciona nombre/teléfono/email, extráelos.
6. WHATSAPP: Activa 'shouldShowWhatsApp: true' solo después de pedir los datos o si el usuario los entrega.

REGLA DE ORO: La confianza se gana ayudando, no insistiendo. Sé el experto que todos quieren contratar.`,
  prompt: `Historia del chat:
{{#each chatHistory}}
  {{this.role}}: {{this.text}}
{{/each}}

Servicios de ANDICOT: {{{servicesContext}}}

Mensaje actual del usuario: "{{{currentMessage}}}"

Instrucción: Sé empático y técnico. No pidas datos de contacto en el primer mensaje si la duda es puramente técnica; primero ayuda y genera curiosidad.`,
});

export async function publicAIChatbot(input: PublicAIChatbotInput): Promise<PublicAIChatbotOutput> {
  const {output} = await publicAIChatbotPrompt(input);
  return output!;
}
