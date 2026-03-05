'use server';
/**
 * @fileOverview A Genkit flow for generating concise commercial descriptions for services using AI.
 *
 * - generateServiceDescription - A function that handles the generation of service descriptions.
 * - GenerateServiceDescriptionInput - The input type for the generateServiceDescription function.
 * - GenerateServiceDescriptionOutput - The return type for the generateServiceDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateServiceDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the service for which to generate a description.'),
});
export type GenerateServiceDescriptionInput = z.infer<typeof GenerateServiceDescriptionInputSchema>;

const GenerateServiceDescriptionOutputSchema = z.object({
  description: z.string().describe('A concise commercial description for the service (max 15-20 words).'),
});
export type GenerateServiceDescriptionOutput = z.infer<typeof GenerateServiceDescriptionOutputSchema>;

export async function generateServiceDescription(input: GenerateServiceDescriptionInput): Promise<GenerateServiceDescriptionOutput> {
  return generateServiceDescriptionFlow(input);
}

const generateServiceDescriptionPrompt = ai.definePrompt({
  name: 'generateServiceDescriptionPrompt',
  input: {schema: GenerateServiceDescriptionInputSchema},
  output: {schema: GenerateServiceDescriptionOutputSchema},
  prompt: `Act as a B2B Copywriter for ANDICOT. Your task is to write a concise and compelling commercial description for a service, based on its title.

Description must be between 15 and 20 words.

Service Title: {{{title}}}`,
});

const generateServiceDescriptionFlow = ai.defineFlow(
  {
    name: 'generateServiceDescriptionFlow',
    inputSchema: GenerateServiceDescriptionInputSchema,
    outputSchema: GenerateServiceDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await generateServiceDescriptionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate service description.');
    }
    return output;
  }
);
