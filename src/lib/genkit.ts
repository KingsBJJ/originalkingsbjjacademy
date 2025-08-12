// lib/genkit.ts
        import { genkit } from '@genkit-ai/core';
        import { googleAI } from '@genkit-ai/googleai'; // Exemplo, adicione os plugins que você usa
        // Importe outros plugins que você precisa (ex: firebase, etc.)

        let isGenkitConfigured = false;

        export function configureGenkit() {
          if (isGenkitConfigured) {
            console.log("Genkit já está configurado.");
            return;
          }

          try {
            genkit.init({
              plugins: [
                googleAI(), // Configure com sua API key se necessário
                // outrosPlugins(),
              ],
              logLevel: 'debug', // 'info' ou 'warn' em produção
              enableTracingAndMetrics: true, // Útil para desenvolvimento
            });
            isGenkitConfigured = true;
            console.log("Genkit inicializado com sucesso!");
          } catch (error) {
            console.error("Falha ao inicializar o Genkit:", error);
            // Você pode querer lançar o erro novamente ou tratar de forma diferente
            // dependendo da sua estratégia de tratamento de erros.
          }
        }