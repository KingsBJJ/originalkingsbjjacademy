// src/ai/genkit.ts
/**
 * @fileoverview This file configures and exports the Genkit AI instance.
 * It sets up the necessary plugins for the application's AI capabilities.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin.
// This `ai` object will be used to define and run all AI flows.
export const ai = genkit({
  plugins: [googleAI()],
});
