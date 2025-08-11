// src/app/api/genkit/route.ts
/**
 * @fileoverview This file creates a Genkit-instrumented Next.js API route.
 *
 * It imports all the flow definitions from the codebase and exports them
 * via a Next.js route handler.
 */
import { ai } from '@/ai/genkit'; // Importa a instância 'ai' que você configurou
import { NextRequest } from 'next/server';
import { createApiHandler } from '@genkit-ai/core/web'; // Importa o handler para web

// Import all flows so that they are registered with the Genkit framework.
import * as trainingFocusFlow from '@/ai/flows/trainingFocusFlow';

// Crie um handler de API usando a instância 'ai'
const handler = createApiHandler({
  ai: ai, // Passe a instância 'ai' configurada
});

// Crie uma rota handler que serve a API Genkit usando o handler criado
export async function POST(req: NextRequest) {
  return await handler(req); // Use o handler para processar a requisição
}
