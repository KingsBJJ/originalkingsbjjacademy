import { defineFlow } from '@genkit-ai/core';

export const simpleTestFlow = defineFlow({
  name: 'simpleTestFlow',
  steps: [
    {
      name: 'start',
      run: async () => {
        return 'Fluxo Genkit funcionando!';
      },
    },
  ],
});
