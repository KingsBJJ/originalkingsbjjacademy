// lib/flows.ts
        import { createFlow } from '@genkit-ai/flow';
        import { z } from 'zod'; // Para definir schemas de entrada/saída (recomendado)
        import { configureGenkit } from './genkit'; // Ajuste o caminho se necessário

        // Chame a configuração do Genkit AQUI, antes de definir qualquer flow
        // Isso garante que os plugins estejam prontos se createFlow depender deles internamente.
        configureGenkit();

        // Exemplo de Flow
        export const meuPrimeiroFlow = createFlow(
          {
            name: 'meuPrimeiroFlow',
            inputSchema: z.object({ prompt: z.string() }), // Exemplo de schema de entrada
            outputSchema: z.string(),                     // Exemplo de schema de saída
          },
          async (input) => {
            console.log("Executando meuPrimeiroFlow com input:", input);
            // Aqui você usaria modelos de IA, chamaria outras APIs, etc.
            // Exemplo:
            // const llmResponse = await generate({
            //   model: googleAI('gemini-pro'), // Certifique-se que o plugin está configurado
            //   prompt: input.prompt,
            // });
            // return llmResponse.text();
            return `Recebido prompt: ${input.prompt} - Processado!`;
          }
        );

        // Defina outros flows aqui
        // export const outroFlow = createFlow(...)
