// src/lib/genkit-config.ts
import * as GenkitCoreModule from '@genkit-ai/core'; // <--- MUDANÇA AQUI
// import { googleAI } from '@genkit-ai/googleai'; // Mantenha, mas o foco é no core
// Para simplificar o teste inicial, vamos comentar googleAI temporariamente,
// podemos adicionar de volta assim que o core.genkit.init funcionar.
import { googleAI, GoogleAIVertex } from '@genkit-ai/googleai'; // Mantenha se precisar do tipo para InitConfig


let isGenkitConfigured = false;

export function configureGenkit(): void {
  console.log(
    'LOG (genkit-config.ts): Tentando executar configureGenkit(). Status atual: ',
    isGenkitConfigured ? 'Já configurado' : 'Não configurado'
  );

  // LOG para verificar o módulo importado e o objeto 'genkit' dentro dele
  console.log(
    "LOG (genkit-config.ts): Verificando 'GenkitCoreModule' importado. typeof:",
    typeof GenkitCoreModule
  );
  if (GenkitCoreModule) {
    console.log(
      "LOG (genkit-config.ts): Conteúdo de GenkitCoreModule:",
      Object.keys(GenkitCoreModule) // Mostra as chaves exportadas
    );
    console.log(
      "LOG (genkit-config.ts): Verificando 'GenkitCoreModule.genkit'. typeof:",
      typeof GenkitCoreModule.genkit,
      "typeof GenkitCoreModule.genkit?.init:",
      typeof GenkitCoreModule.genkit?.init
    );
  } else {
    console.log("LOG (genkit-config.ts): GenkitCoreModule é undefined!");
  }


  if (isGenkitConfigured) {
    console.log('LOG (genkit-config.ts): Genkit já configurado, pulando init.');
    return;
  }

  try {
    const genkit = GenkitCoreModule.genkit; // <--- USAR A VERSÃO DO NAMESPACE

    if (genkit && typeof genkit.init === 'function') {
      console.log("LOG (genkit-config.ts): 'genkit' e 'genkit.init' são válidos. Inicializando Genkit...");
      genkit.init({ // Removido o cast para InitConfig temporariamente para simplificar
        plugins: [
          googleAI(), // Descomente quando o problema principal for resolvido
        ],
        logLevel: 'debug',
        enableTracingAndMetrics: true,
      });

      isGenkitConfigured = true;
      console.log('LOG (genkit-config.ts): Genkit inicializado com SUCESSO.');
    } else {
      console.error(
        "LOG (genkit-config.ts): ERRO CRÍTICO - O objeto 'genkit' (de GenkitCoreModule.genkit) é inválido ou não possui o método 'init'. 'GenkitCoreModule.genkit' é:",
        GenkitCoreModule ? GenkitCoreModule.genkit : "GenkitCoreModule é undefined"
      );
    }
  } catch (error) {
    console.error(
      'LOG (genkit-config.ts): ERRO CRÍTICO EXCEPCIONAL ao tentar inicializar Genkit (dentro do bloco catch):',
      error
    );
    // Se o erro for sobre InitConfig, podemos precisar do tipo:
    // console.error('Se for erro de tipo, InitConfig pode ser necessário no genkit.init');
  }
}
