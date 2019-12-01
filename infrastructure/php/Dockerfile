FROM php:7.4.0-fpm-alpine3.10

ARG UID=1000
ARG GID=1000
ARG XDEBUG=1

WORKDIR /var/www

COPY ./config/xdebug.ini /etc/php7/conf.d/xdebug.ini

RUN apk --no-cache add shadow \
    && php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --filename=composer --install-dir=/usr/bin \
    && php -r "unlink('composer-setup.php');"

RUN usermod -u $UID www-data \
    && groupmod -g $GID www-data

USER www-data

CMD ["php-fpm", "-R"]