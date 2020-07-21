FROM node:13-alpine as build-stage
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=prod

COPY tsconfig.json ./
COPY src src/
COPY dev dev/
COPY knex knex/
RUN npm run build

FROM node:13-alpine as production-stage
WORKDIR /app

COPY --from=build-stage /app/package.json ./
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/knex ./knex
COPY --from=build-stage /app/dev ./dev

CMD ["npm", "start"]
