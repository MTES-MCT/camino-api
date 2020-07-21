FROM node:13-alpine as build-stage
LABEL maintainer=francois.romain@beta.gouv.fr

ENV dir /app
WORKDIR $dir

COPY package*.json ./
RUN npm ci --only=prod

COPY tsconfig.json ./
COPY src src/
COPY dev dev/
COPY knex knex/

RUN npm run build

FROM node:13-alpine as production-stage

COPY --from=build-stage /app/package.json ./
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/knex ./knex
COPY --from=build-stage /app/dev ./dev

CMD ["npm", "start"]
