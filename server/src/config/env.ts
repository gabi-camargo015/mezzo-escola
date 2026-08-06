import 'dotenv/config';

import { z } from 'zod';

const environmentSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  WEB_ORIGIN: z.string().url(),
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  console.error('Configuração de ambiente inválida:', parsedEnvironment.error.flatten().fieldErrors);
  throw new Error('Não foi possível iniciar a API devido a variáveis de ambiente inválidas.');
}

export const env = parsedEnvironment.data;
