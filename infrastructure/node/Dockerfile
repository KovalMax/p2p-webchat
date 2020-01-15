FROM node:12.14.0-alpine3.10

ARG UID=1000
ARG GID=1000
ARG NODE_USER_NAME=node

WORKDIR /var/www

RUN deluser --remove-home $NODE_USER_NAME \
    && addgroup -S $NODE_USER_NAME -g $GID \
    && adduser -S -G $NODE_USER_NAME -u $UID $NODE_USER_NAME

RUN chown -R $UID:$GID /var/www

USER $NODE_USER_NAME

RUN mkdir node_modules

COPY socket-app/package*.json ./

RUN npm i --quiet \
    && npm cache clean --force

COPY socket-app/ ./

CMD npm run start:$NODE_ENV