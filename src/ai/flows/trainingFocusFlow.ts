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

