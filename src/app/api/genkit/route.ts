// src/app/api/genkit/route.ts
/**
 * @fileoverview This file creates a Genkit-instrumented Next.js API route.
 *
 * It imports all the flow definitions from the codebase and exports them
 * via a Next.js route handler.
 */
import { ai } from '@/ai/genkit';
import { NextRequest, NextResponse } from 'next/server';
import * as firebaseGenkit from '@genkit-ai/firebase'; // Importa o handler para web

// Import all flows so that they are registered with the Genkit framework.
import * as trainingFocusFlow from '@/ai/flows/trainingFocusFlow';

// Crie um handler de API usando a instância 'ai'
const handler = firebaseGenkit.createApiHandler({
  ai: ai, // Passe a instância 'ai' configurada
});

// Create a route handler that serves the Genkit API.
export async function POST(req: NextRequest) {
  return await handler(req); // Use o handler para processar a requisição
}