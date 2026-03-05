'use server';
/**
 * @fileOverview An AI agent that generates SEO-optimized meta descriptions and keywords.
 *
 * - generateSeoMetadata - A function that handles the SEO metadata generation process.
 * - GenerateSeoMetadataInput - The input type for the generateSeoMetadata function.
 * - GenerateSeoMetadataOutput - The return type for the generateSeoMetadata function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSeoMetadataInputSchema = z.object({
  heroTitle: z.string().describe('The main title of the hero section.'),
  heroSubtitle: z.string().describe('The subtitle of the hero section.'),
});
export type GenerateSeoMetadataInput = z.infer<typeof GenerateSeoMetadataInputSchema>;

const GenerateSeoMetadataOutputSchema = z.object({
  metaDescription: z.string().describe('An attractive meta description (max 160 characters) for SEO.'),
  keywords: z.array(z.string()).describe('5 to 7 relevant keywords for SEO, as an array of strings.'),
});
export type GenerateSeoMetadataOutput = z.infer<typeof GenerateSeoMetadataOutputSchema>;

export async function generateSeoMetadata(input: GenerateSeoMetadataInput): Promise<GenerateSeoMetadataOutput> {
  return generateSeoMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSeoMetadataPrompt',
  input: { schema: GenerateSeoMetadataInputSchema },
  output: { schema: GenerateSeoMetadataOutputSchema },
  prompt: `Actúa como Experto SEO B2B para la empresa ANDICOT.
Basado en el Título: "{{{heroTitle}}}" y Subtítulo: "{{{heroSubtitle}}}", genera:
1. Una meta descripción atractiva (máximo 160 caracteres).
2. 5 a 7 palabras clave relevantes.

Formato exacto de respuesta:
{
  "metaDescription": "[Tu texto aquí]",
  "keywords": ["Palabra1", "Palabra2", "Palabra3", "Palabra4", "Palabra5"]
}`,
});

const generateSeoMetadataFlow = ai.defineFlow(
  {
    name: 'generateSeoMetadataFlow',
    inputSchema: GenerateSeoMetadataInputSchema,
    outputSchema: GenerateSeoMetadataOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate SEO metadata.');
    }
    return output;
  }
);
