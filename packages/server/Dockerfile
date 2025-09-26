FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./tsconfig.json ./tsconfig.json

COPY ./packages/server/package.json ./packages/server/package.json
COPY ./packages/server/tsconfig.json ./packages/server/tsconfig.json

RUN pnpm install

COPY ./packages/server/src ./packages/server/src

EXPOSE 3001
CMD ["pnpm", "dev"]