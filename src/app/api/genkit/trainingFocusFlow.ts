// src/genkit/trainingFocusFlow.ts
import { createFlow } from 'genkit'; // Certifique-se de importar diretamente de 'genkit'

export const trainingFocusFlow = createFlow({
  name: 'trainingFocusFlow',
  steps: [
    {
      name: 'step1',
      handler: async (data) => {
        console.log('Step 1:', data);
        return data;
      },
    },
    {
      name: 'step2',
      handler: async (data) => {
        console.log('Step 2:', data);
        return data;
      },
    },
  ],
});
