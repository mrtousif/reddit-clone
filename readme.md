# Reddit clone

A Fastify, MikroORM, TypeGraphQL boilerplate for GraphQL made with Typescript

Inspired by https://github.com/driescroons/mikro-orm-graphql-example

## 📦 Major Packages

-   [Fastify](https://www.fastify.io/)
-   [MikroORM](https://mikro-orm.io/)
-   [TypeGraphQL](https://typegraphql.com/)

---

## ✨ Installation

1. Install dependencies via `pnpm`
2. Create your docker containers via `docker-compose up -d`
3. Load fixtures `pnpm loadFixtures`
4. Run via `pnpm start` or `pnpm dev`

---

## ⚡️ Usage

#### Run with Node

Run the regular start command

#### Run with ts-node-dev

Run and watch the application in Typescript.

#### Run with debugger

I've added the launch script for VSCode in the repository. You can start the application by going to the Debug and Run tab and clicking on `Debug Application`

### Migrations

After developing a feature, run the following commands to create a migration from the previous migration schema state:

```
pnpm mikro-orm schema:drop --run
pnpm mikro-orm migration:up
pnpm mikro-orm migration:create
```
