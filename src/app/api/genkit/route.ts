// src/app/api/genkit/route.ts
/**
 * @fileoverview This file creates a Genkit-instrumented Next.js API route.
 *
 * It imports all the flow definitions from the codebase and exports them
 * via a Next.js route handler.
 */
import { genkit } from '@/ai/genkit';
import { NextRequest } from 'next/server';

// Import all flows so that they are registered with the Genkit framework.
import * as trainingFocusFlow from '@/ai/flows/trainingFocusFlow';

// Create a route handler that serves the Genkit API.
export async function POST(req: NextRequest) {
  return await genkit.handleApiRequest(req);
}
