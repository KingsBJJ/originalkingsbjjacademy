// src/app/api/genkit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { genkit } from '@/lib/genkit'; // Assumindo que o Genkit está inicializado em src/lib/genkit
import * as trainingFocusFlow from '@/ai/flows/trainingFocusFlow'; // Verifique este caminho

// Importe outros fluxos, se necessário
// import * as otherFlow from '@/ai/flows/otherFlow';

export const someFunction = async (input: any) => {
  return { message: 'Exemplo', input };
};export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Exemplo: Processar a requisição com o fluxo do Genkit
    const result = await trainingFocusFlow.someFunction(body); // Ajuste com base nas exportações reais
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Erro na API do Genkit:', error);
    return NextResponse.json(
      { success: false, error: 'Erro Interno do Servidor' },
      { status: 500 }
    );
  }
}