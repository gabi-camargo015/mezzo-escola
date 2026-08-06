import 'dotenv/config';

import bcrypt from 'bcrypt';
import { z } from 'zod';

import { prisma } from '../lib/prisma.js';

const inputSchema = z.object({
  ADMIN_EMAIL: z.string().trim().email(),
  ADMIN_NAME: z.string().trim().min(2).max(150),
  ADMIN_PASSWORD: z.string().min(12).max(128),
});

async function createAdministrator() {
  const input = inputSchema.parse(process.env);
  const existingUser = await prisma.user.findUnique({ where: { email: input.ADMIN_EMAIL } });
  if (existingUser) throw new Error('Já existe um usuário com este e-mail. Nenhum dado foi alterado.');

  const passwordHash = await bcrypt.hash(input.ADMIN_PASSWORD, 12);
  const user = await prisma.user.create({ data: { name: input.ADMIN_NAME, email: input.ADMIN_EMAIL, passwordHash, role: 'ADMIN' } });
  console.info(`Administrador criado com sucesso: ${user.email}`);
}

void createAdministrator()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
