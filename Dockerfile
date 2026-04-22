FROM node:20-slim AS builder
WORKDIR /app
RUN corepack enable
COPY pnpm-lock.yaml package.json ./
RUN pnpm i --frozen-lockfile
COPY . .
RUN pnpm build
# Eliminamos dependencias de desarrollo para aligerar la carga
RUN pnpm prune --prod

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
# Copiamos solo lo esencial
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

EXPOSE 3000
CMD [ "node", "build" ]