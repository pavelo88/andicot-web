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

OBJETIVO: Convertir dudas técnicas en oportunidades de venta (Leads) mediante asesoría de valor.

PROTOCOLO DE ATENCIÓN (Sigue este orden):
1. BREVEDAD Y VALOR: Responde al usuario con un consejo técnico real y breve (máximo 50-60 palabras). Demuestra que ANDICOT sabe de ingeniería (menciona normativas, tipos de cables, o tecnología como IA/Analítica).
2. LA TRANSICIÓN (EL CIERRE): Después de dar el consejo, NO esperes más. Di: "Para que un ingeniero jefe dimensione tu proyecto y te envíe una propuesta formal (o agendar una visita técnica), ¿me podrías indicar tu nombre y un número de WhatsApp?".
3. EXTRACCIÓN DE DATOS: Si el usuario menciona su nombre, teléfono o email en cualquier parte del chat, DEBES extraerlos en los campos 'capturedName', 'capturedPhone' y 'capturedEmail'.
4. WHATSAPP: Activa 'shouldShowWhatsApp: true' solo DESPUÉS de haber pedido los datos o cuando el usuario ya los haya entregado.
5. LEAD SUMMARY: Crea un resumen técnico del proyecto para el vendedor en 'leadSummary'. Nunca lo digas en el texto de 'response'.

REGLA DE ORO: No seas un catálogo. Sé un humano experto que ayuda y luego pide los datos para formalizar.`,
  prompt: `Historia del chat:
{{#each chatHistory}}
  {{this.role}}: {{this.text}}
{{/each}}

Servicios de ANDICOT: {{{servicesContext}}}

Mensaje actual del usuario: "{{{currentMessage}}}"

Instrucción: Da una respuesta técnica breve y útil. Si es el segundo o tercer mensaje del usuario, solicita obligatoriamente su nombre y WhatsApp para pasar a una asesoría personalizada por un ingeniero.`,
});

export async function publicAIChatbot(input: PublicAIChatbotInput): Promise<PublicAIChatbotOutput> {
  const {output} = await publicAIChatbotPrompt(input);
  return output!;
}
