# MEZZO Escola de Música

Plataforma da MEZZO Escola de Música composta por um site institucional em React e um sistema de gestão para Administração, Professores, Alunos e Responsáveis.

## Arquitetura

```text
mezzo-escola/
├── src/                    # Front-end React + TypeScript + Tailwind CSS
│   ├── app/                # Rotas e composição da aplicação
│   └── features/           # Módulos públicos, autenticação e portais
├── server/                 # API Node.js + Express + Prisma
│   ├── prisma/             # Modelo PostgreSQL
│   └── src/features/       # Autenticação, dashboard, agenda e portais
├── package.json            # Front-end
└── .env.example            # Ambiente do front-end
```

## Tecnologias

- React, TypeScript, Vite e Tailwind CSS;
- Node.js, Express, Prisma e PostgreSQL;
- JWT de acesso, refresh token em cookie HTTP-only e RBAC;
- Zod para validação de entrada;
- Estrutura preparada para integrações de pagamentos e comunicação.

## Módulos iniciados

- Site institucional: Home, A MEZZO, Cursos e páginas individuais, Contato, Professores e Galeria;
- Autenticação: login, renovação de sessão, logout e controle de perfil;
- Portal Administrativo: indicadores reais, agenda do dia e alertas financeiros;
- Portal do Professor: agenda e alunos vinculados;
- Portal do Aluno: próximas aulas, frequência e financeiro;
- Portal do Responsável: alunos vinculados, agenda, frequência e financeiro;
- Agenda: criação administrativa, consulta por perfil e prevenção de conflitos;
- Banco de dados: usuários, perfis, cursos, salas, matrículas, aulas, presença, faturas, pagamentos, sessões e auditoria.

## Configuração local

1. Instale Node.js 20.19 ou superior e PostgreSQL.
2. Copie `.env.example` para `.env` na raiz e configure `VITE_API_URL`.
3. Copie `server/.env.example` para `server/.env` e configure banco e segredos JWT.
4. Instale as dependências do front-end:

   ```bash
   pnpm install
   ```

5. Instale as dependências da API:

   ```bash
   cd server
   pnpm install
   ```

6. Gere o cliente Prisma e aplique a primeira migração:

   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate --name init
   ```

7. Em terminais distintos, execute:

   ```bash
   # raiz do projeto
   pnpm dev

   # pasta server
   pnpm dev
   ```

## Dados institucionais obrigatórios antes do lançamento

- Logo, favicon, fotos autorizadas e artes oficiais;
- Telefone, WhatsApp, e-mail, endereço, Google Maps, Instagram e Facebook;
- Nomes, especialidades, biografias e redes da equipe;
- Horários, modalidades, planos e valores dos cursos;
- Domínio final para SEO, Open Graph e CORS;
- Credenciais de produção para PostgreSQL, provedor de pagamento, e-mail e WhatsApp Business.

Nenhum desses dados deve ser inventado. Os pontos que dependem deles estão identificados na interface.

## Segurança

- Senhas armazenadas somente por hash bcrypt;
- Access token de curta duração;
- Refresh token revogável, armazenado em cookie HTTP-only;
- Autorização por perfil na API e nas rotas do cliente;
- Helmet, CORS restrito e validação de ambiente;
- Estrutura de auditoria para operações críticas.

## Próximos módulos do PRD

- CRUD completo de cadastros, agenda visual e presença;
- Financeiro, pagamentos, remuneração de professores e relatórios;
- CRM, comunicação, materiais e notificações;
- Integração de pagamentos, WhatsApp Business e e-mail;
- Testes automatizados, observabilidade, backups e implantação.
