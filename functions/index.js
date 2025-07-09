const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Inicializa o Firebase Admin
let app;
try {
  app = initializeApp();
  logger.info("Firebase Admin inicializado com sucesso", { structuredData: true });
} catch (error) {
  logger.error("Erro ao inicializar o Firebase Admin:", error);
  throw new Error("Falha na inicialização do Firebase Admin");
}

// Inicializa o Firestore com o banco (default)
const db = getFirestore(app, "(default)");
try {
  db.settings({ ignoreUndefinedProperties: true });
  logger.info("Firestore configurado para o banco (default)", { structuredData: true });
} catch (error) {
  logger.error("Erro ao configurar o Firestore:", error);
  throw new Error("Falha na configuração do Firestore");
}

// Função HTTP para teste
exports.helloWorld = onRequest(
  { region: "us-central" },
  (request, response) => {
    logger.info("Função helloWorld chamada!", { structuredData: true });
    response.send("Olá! Função ativa no Firebase.");
  }
);

// Função acionada quando um aluno é criado
exports.logNewStudent = onDocumentCreated(
  {
    region: "us-central",
    document: "users/{userId}",
  },
  async (event) => {
    try {
      const newUser = event.data.data();
      const userId = event.params.userId;

      if (newUser.role === "student") {
        logger.info(`Novo aluno criado: ${newUser.name} (ID: ${userId})`, {
          structuredData: true,
        });
        await db.collection("logs").add({
          type: "Novo Aluno",
          message: `Aluno ${newUser.name} foi cadastrado.`,
          timestamp: new Date(),
          userId,
        });
      }
    } catch (error) {
      logger.error("Erro ao registrar novo aluno:", error);
      throw error;
    }
  }
);