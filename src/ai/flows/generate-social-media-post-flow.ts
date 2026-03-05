'use server';
/**
 * @fileOverview A Genkit flow for generating social media posts for services.
 *
 * - generateSocialMediaPost - A function that handles the generation of social media posts.
 * - GenerateSocialMediaPostInput - The input type for the generateSocialMediaPost function.
 * - GenerateSocialMediaPostOutput - The return type for the generateSocialMediaPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaPostInputSchema = z.object({
  title: z.string().describe('The title of the service.'),
  description: z.string().describe('The description of the service.'),
});
export type GenerateSocialMediaPostInput = z.infer<typeof GenerateSocialMediaPostInputSchema>;

const GenerateSocialMediaPostOutputSchema = z.string().describe('The generated social media post.');
export type GenerateSocialMediaPostOutput = z.infer<typeof GenerateSocialMediaPostOutputSchema>;

const generateSocialMediaPostPrompt = ai.definePrompt({
  name: 'generateSocialMediaPostPrompt',
  input: {schema: GenerateSocialMediaPostInputSchema},
  output: {schema: GenerateSocialMediaPostOutputSchema},
  prompt: `Actúa como Community Manager experto en tecnología B2B. Redacta un post corto, muy atractivo y persuasivo para LinkedIn promocionando este servicio de la empresa ANDICOT:

Servicio: {{{title}}}
Descripción actual: {{{description}}}

Requisitos:
- Usa 2 o 3 emojis.
- Incluye 3 hashtags relevantes.
- Mantenlo corporativo pero moderno.`,
  config: {
    model: 'googleai/gemini-1.5-flash',
    temperature: 0.7,
  },
});

const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async (input) => {
    const {output} = await generateSocialMediaPostPrompt(input);
    return output!;
  }
);

export async function generateSocialMediaPost(
  input: GenerateSocialMediaPostInput
): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}
