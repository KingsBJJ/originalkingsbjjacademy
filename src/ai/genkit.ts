
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      // Nenhuma chave de API necessária aqui, pois o Genkit
      // irá buscá-la automaticamente das variáveis de ambiente.
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
