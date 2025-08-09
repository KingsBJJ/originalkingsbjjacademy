<<<<<<< HEAD
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
=======
'use server';
// src/ai/flows/trainingFocusFlow.ts

export type TrainingFocusInput = {
  studentId: string;
  goals?: string;
};

export type TrainingFocusOutput = {
  focus: string;
  suggestions: string[];
};

export async function generateTrainingFocus(
  input: TrainingFocusInput
): Promise<TrainingFocusOutput> {
  // Versão mínima para não quebrar build
  return {
    focus: `Foco sugerido para o aluno ${input.studentId}`,
    suggestions: [
      'Trabalhar passagens de guarda',
      'Aprimorar raspagens básicas',
      'Treinar finalizações do back'
    ],
  };
}
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
