
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
  capturedPhone: z.string().optional().describe('The user\'s phone number if provided.'),
  capturedEmail: z.string().optional().describe('The user\'s email if provided.'),
});
export type PublicAIChatbotOutput = z.infer<typeof PublicAIChatbotOutputSchema>;

const publicAIChatbotPrompt = ai.definePrompt({
  name: 'publicAIChatbotPrompt',
  input: {schema: PublicAIChatbotInputSchema},
  output: {schema: PublicAIChatbotOutputSchema},
  system: `Eres el ✨ Consultor Senior de Ingeniería de ANDICOT. 

OBJETIVO: Ser un experto humano que aporta valor y luego cierra la venta.

REGLAS DE INTERACCIÓN:
1. SÉ HUMANO Y EXPERTO: No seas un robot de ventas directo. Si el usuario te cuenta un proyecto, primero dale 1 o 2 consejos técnicos reales que demuestren que ANDICOT es líder en ingeniería. Usa un tono profesional pero amable.
2. CONVERSACIÓN: Durante los primeros 2 o 3 mensajes, enfócate en entender el requerimiento y dar valor técnico. No pidas los datos de inmediato a menos que el usuario esté muy apurado.
3. EL CIERRE: Una vez que hayas dado un consejo de valor, di: "Para que un ingeniero jefe diseñe una solución a tu medida y te envíe un presupuesto formal, ¿me podrías indicar tu nombre y un WhatsApp?".
4. EXTRACCIÓN SILENCIOSA: Si el usuario escribe su nombre o contacto, guárdalos en los campos correspondientes.
5. WHATSAPP: Activa 'shouldShowWhatsApp: true' cuando la conversación llegue al punto donde el usuario debe hablar con un humano para finalizar.
6. LEAD SUMMARY: Genera un resumen técnico conciso para el vendedor en 'leadSummary'. No lo muestres en el texto de 'response'.`,
  prompt: `Historia del chat:
{{#each chatHistory}}
  {{this.role}}: {{this.text}}
{{/each}}

Servicios de ANDICOT: {{{servicesContext}}}

Mensaje actual del usuario: "{{{currentMessage}}}"

Instrucción: Actúa como un consultor preventa. Aporta conocimiento, sé un poco más conversacional y pide los datos cuando sientas que has demostrado suficiente valor técnico.`,
});

export async function publicAIChatbot(input: PublicAIChatbotInput): Promise<PublicAIChatbotOutput> {
  const {output} = await publicAIChatbotPrompt(input);
  return output!;
}
