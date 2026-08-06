import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.info(`API da MEZZO disponível na porta ${env.PORT}.`);
});

const shutdown = (signal: string) => {
  console.info(`Sinal ${signal} recebido. Encerrando API...`);
  server.close((error) => {
    if (error) {
      console.error('Erro ao encerrar a API:', error);
      process.exitCode = 1;
    }
    process.exit();
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
