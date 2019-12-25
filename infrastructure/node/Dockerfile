FROM node:12.14.0-alpine3.10

WORKDIR /var/www

COPY socket-app/package*.json ./

RUN npm install

COPY socket-app/ .

CMD ["npm", "start"]