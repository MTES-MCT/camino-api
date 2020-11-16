FROM node:15-alpine as build-stage
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=prod

COPY tsconfig.json ./
COPY src src/
COPY dev dev/
COPY knex knex/
RUN npm run build

FROM node:15-alpine as production-stage
WORKDIR /app

# redirige les logs sur le collecteur de logs docker
# cf le Dockerfile de nginx
# https://github.com/nginxinc/docker-nginx/blob/8921999083def7ba43a06fabd5f80e4406651353/mainline/jessie/Dockerfile#L21-L23
RUN ln -sf /dev/stdout /app/app.log

COPY --from=build-stage /app/package.json ./
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/knex ./knex
COPY --from=build-stage /app/dev ./dev

CMD ["npm", "start"]
