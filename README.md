# Desafio - API de Pedidos

API REST para gerenciamento de pedidos, construída com Node.js, Express, Prisma e PostgreSQL.

## Tecnologias

- Node.js
- Express
- Prisma
- PostgreSQL
- JWT
- Swagger

## Requisitos

- Node.js 18+
- PostgreSQL rodando

## Configuracao

1. Instale as dependencias:

```bash
npm install
```

2. Crie/ajuste o arquivo `.env` com:

```env
PORT=3000
DATABASE_URL="postgresql://usuario:senha@localhost:5432/seu_banco"
JWT_SECRET="seu_segredo_jwt"
```

3. Gere o client do Prisma (se necessario):

```bash
npx prisma generate
```

4. Execute as migrations (se necessario):

```bash
npx prisma migrate dev
```

## Como rodar

Modo desenvolvimento:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

## Documentacao Swagger

Com a API rodando, acesse:

`http://localhost:3000/api-docs`

## Autenticacao

As rotas de pedidos exigem token JWT no header:

`Authorization: Bearer <token>`

Comando rapido para gerar token no PowerShell:

```powershell
$env:JWT_SECRET="seu_segredo_jwt"; node -e "console.log(require('jsonwebtoken').sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' }))"
```

## Rotas principais

Base URL: `http://localhost:3000`

- `POST /orders` cria pedido
- `GET /orders` lista pedidos
- `GET /orders/:id` busca pedido por id
- `PUT /orders/:id` atualiza pedido
- `DELETE /orders/:id` remove pedido

## Script disponivel

- `npm run dev` inicia com nodemon
- `npm start` inicia em modo normal
- `npm run db:studio` abre Prisma Studio
