FROM nginx:1.17-alpine

ARG SERVER_NAME=localhost

RUN mkdir -pv /var/www/public \
    && touch /var/www/public/index.php \
    && chown -R nginx:nginx /var/www

COPY config/application.conf /etc/nginx/conf.d/
COPY config/fastcgi_params.inc /etc/nginx/custom.d/

EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]