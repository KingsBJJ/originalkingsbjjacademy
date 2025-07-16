import '@/genkit/bootstrap';
import createGenkitRouteHandler from '@genkit-ai/next';

const handler = createGenkitRouteHandler();
const nome = obj?.name ?? 'sem-nome';


export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
