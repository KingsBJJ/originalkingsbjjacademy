// src/genkit/genkitHandler.ts
'use server';

import { initGenkit } from '@genkit-ai/core';
import { simpleTestFlow } from './simpleTestFlow';
import createGenkitRouteHandler from '@genkit-ai/next';

let initialized = false;

if (!initialized) {
  initGenkit({
    plugins: [],
    flows: [simpleTestFlow],
  });
  initialized = true;
}

const handler = createGenkitRouteHandler();

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
