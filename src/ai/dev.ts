import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-lead-flow.ts';
import '@/ai/flows/generate-seo-metadata-flow.ts';
import '@/ai/flows/generate-social-media-post-flow.ts';
import '@/ai/flows/generate-proposal-flow.ts';
import '@/ai/flows/public-ai-chatbot-flow.ts';
import '@/ai/flows/generate-service-description-flow.ts';