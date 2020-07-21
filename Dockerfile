FROM node:13-alpine as build-stage
LABEL maintainer=francois.romain@beta.gouv.fr

# install node-prune (https://github.com/tj/node-prune)
RUN apk update && apk add curl bash
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

ENV dir /app
WORKDIR $dir

COPY package*.json ./
RUN npm ci --only=prod

COPY tsconfig.json ./
COPY src src/
COPY dev dev/
COPY knex knex/

RUN npm run build
RUN /usr/local/bin/node-prune

FROM node:13-alpine as production-stage

COPY --from=build-stage /app/package.json ./
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/knex ./knex
COPY --from=build-stage /app/dev ./dev

CMD ["npm", "start"]
