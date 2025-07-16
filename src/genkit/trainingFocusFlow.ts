// src/genkit/trainingFocusFlow.ts

import { defineFlow } from '@genkit-ai/core';
import { z } from 'zod';

export const trainingFocusFlow = defineFlow(
  {
    name: 'trainingFocusFlow',
    inputSchema: z.object({
      prompt: z.string().describe('O prompt para o foco do treinamento'),
    }),
    outputSchema: z.string().describe('O resultado ou foco do treinamento gerado'),
  },
  async (input) => {
    console.log(
      `LOG (trainingFocusFlow.ts): Executando 'trainingFocusFlow' com input: ${JSON.stringify(input)}`
    );

    const result = `Foco de treinamento para "${input.prompt}": (Resultado do modelo aqui).`;
    console.log("LOG (trainingFocusFlow.ts): 'trainingFocusFlow' executado, retornando resultado.");
    return result;
  }
);
