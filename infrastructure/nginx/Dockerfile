FROM nginx:1.17.6-alpine

ARG SERVER_NAME=localhost

COPY ./config/application.conf /etc/nginx/conf.d/
COPY ./config/fastcgi_params.inc /etc/nginx/custom.d/

RUN grep -q 'server_name' /etc/nginx/conf.d/application.conf || sed -i "/listen/a server_name $SERVER_NAME;" /etc/nginx/conf.d/application.conf

CMD ["nginx", "-g", "daemon off;"]