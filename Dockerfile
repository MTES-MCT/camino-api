FROM node:alpine
LABEL maintainer=francois.romain@beta.gouv.fr

# NodeJS Docker Webapp - Official Doc
# @see https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# NodeJS / Docker - Best Practices
# @see https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md

# to install global npm dependencies
# ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# ENV PATH=$PATH:/home/node/.npm-global/bin

ENV NODE_ENV production
ENV dir /home/camino/api
WORKDIR $dir

# cache node_modules if no changes to package.json
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
ADD package.json /tmp/package.json
RUN cd /tmp && npm install && cp -a /tmp/node_modules $dir/

COPY . $dir
EXPOSE 3000

# !!! DO NOT RUN AS `ROOT` !!!
USER node
CMD ["npm", "start"]

# build
# docker build --no-cache -t fr/camino-api .

# run 
# docker run -p 3000:3000 fr/camino-api
