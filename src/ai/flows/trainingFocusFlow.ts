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
/**
 * @fileOverview A flow to generate personalized training focus for a student.
 * 
 * - generateTrainingFocus - A function that generates training focus points.
 * - TrainingFocusInput - The input type for the generateTrainingFocus function.
 * - TrainingFocusOutput - The return type for the generateTrainingFocus function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TrainingFocusInputSchema = z.object({
  studentName: z.string().describe("The student's name."),
  studentBelt: z.string().describe("The student's belt level (e.g., Branca, Azul, Roxa)."),
});
export type TrainingFocusInput = z.infer<typeof TrainingFocusInputSchema>;

const TrainingFocusOutputSchema = z.object({
  focusPoints: z.array(z.string()).length(3).describe('A list of three specific training focus points for the student.'),
});
export type TrainingFocusOutput = z.infer<typeof TrainingFocusOutputSchema>;

const prompt = ai.definePrompt({
    name: 'trainingFocusPrompt',
    input: { schema: TrainingFocusInputSchema },
    output: { schema: TrainingFocusOutputSchema },
    prompt: `
        You are a world-class Brazilian Jiu-Jitsu head coach for the Kings BJJ team.
        Your task is to provide three concise, specific, and actionable training focus points for a student based on their belt level.

        Student: {{{studentName}}}
        Belt: {{{studentBelt}}}

        Generate three distinct focus points that are appropriate for their current level.
        For lower belts (White, Blue), focus on fundamentals, survival, and core concepts.
        For intermediate belts (Purple, Brown), focus on developing a specific game, strategy, and combining techniques.
        For advanced belts (Black), focus on refining details, teaching, and advanced concepts.

        The points should be short and encouraging. Frame them as "Foco em..." or "Desenvolver...".

        Example for a Blue Belt:
        - Foco em controle posicional antes da finalização.
        - Desenvolver duas raspagens eficazes da guarda aberta.
        - Refinar a defesa contra passagens de guarda comuns.

        Example for a Purple Belt:
        - Desenvolver ataques a partir da guarda De La Riva.
        - Foco em transições entre finalizações.
        - Aprimorar o timing para leg drags e passagens de guarda em pé.
    `,
});

const trainingFocusFlow = ai.defineFlow(
    {
        name: 'trainingFocusFlow',
        inputSchema: TrainingFocusInputSchema,
        outputSchema: TrainingFocusOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);

export async function generateTrainingFocus(input: TrainingFocusInput): Promise<TrainingFocusOutput> {
    return await trainingFocusFlow(input);
}
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
