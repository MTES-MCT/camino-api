FROM node:latest
LABEL maintainer=francois.romain@beta.gouv.fr

ENV dir /app
ENV NODE_ENV production
WORKDIR $dir

# cache node_modules if no changes to package.json
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
COPY package.json /tmp/package.json
RUN cd /tmp && npm install && cp -a /tmp/node_modules $dir/

COPY .env ./
COPY package*.json ./
COPY index.js ./
COPY config config/
COPY api api/
COPY database database/
COPY tools tools/
COPY tasks tasks/

CMD ["npm", "start"]

