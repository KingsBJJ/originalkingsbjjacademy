// src/genkit/init.ts

import { initGenkit } from '@genkit-ai/core';
import { simpleTestFlow } from './simpleTestFlow';

// Verifica se já foi inicializado para evitar duplicação
declare global {
  // eslint-disable-next-line no-var
  var __GENKIT_INITIALIZED__: boolean | undefined;
}

if (!global.__GENKIT_INITIALIZED__) {
  initGenkit({
    plugins: [],
    flows: [simpleTestFlow],
  });
  global.__GENKIT_INITIALIZED__ = true;
}
