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
  system: `Eres el ✨ Consultor de Ingeniería de ANDICOT. 

OBJETIVO: Brindar una respuesta técnica inicial de VALOR y capturar datos para el CRM.

REGLAS DE ORO:
1. RESPUESTA TÉCNICA: Si el usuario pregunta por un proyecto (ej. cámaras, redes), dale 1 consejo técnico real basado en los servicios disponibles (máximo 3 oraciones). Demuestra que sabemos de ingeniería.
2. CAPTURA DE DATOS: Después del consejo, di: "Para enviarte un diseño técnico y presupuesto exacto, ¿me podrías indicar tu nombre y un número de WhatsApp o correo?".
3. EXTRACCIÓN: Si el usuario escribe su nombre, teléfono o correo, guárdalos en los campos correspondientes del output (capturedName, capturedPhone, capturedEmail).
4. CIERRE: Solo activa 'shouldShowWhatsApp: true' cuando ya tengas una idea del proyecto Y los datos de contacto, o si el usuario insiste en hablar con alguien.
5. LEAD SUMMARY: Genera un resumen técnico conciso para el vendedor en 'leadSummary'.`,
  prompt: `Historia del chat:
{{#each chatHistory}}
  {{this.role}}: {{this.text}}
{{/each}}

Servicios de ANDICOT: {{{servicesContext}}}

Mensaje actual del usuario: "{{{currentMessage}}}"

Instrucción: Sé profesional, aporta conocimiento técnico breve y asegúrate de pedir los datos de contacto de forma natural.`,
});

export async function publicAIChatbot(input: PublicAIChatbotInput): Promise<PublicAIChatbotOutput> {
  const {output} = await publicAIChatbotPrompt(input);
  return output!;
}
