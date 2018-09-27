FROM node:latest
LABEL maintainer=francois.romain@beta.gouv.fr

ENV dir /app
ENV NODE_ENV production
WORKDIR $dir

# cache node_modules if no changes to package.json
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
COPY package.json /temp/package.json
RUN cd /temp && npm install && cp -a /temp/node_modules $dir/

COPY .env ./
COPY package*.json ./
COPY index.js ./
COPY auth auth/
COPY config config/
COPY graphql graphql/
COPY postgres postgres/
COPY _tools _tools/
COPY tasks tasks/

CMD ["npm", "start"]

