FROM php:7.4.0-fpm-alpine3.10

ENV PHP_DEPS build-base autoconf curl-dev gmp-dev libpng-dev libxml2-dev libmcrypt-dev imagemagick-dev icu-dev libzip-dev

ARG UID=1000
ARG GID=1000
ARG XDEBUG=1

WORKDIR /var/www

COPY ./config/xdebug.ini /etc/php7/conf.d/xdebug.ini

RUN set -eux \
    && apk update \
    && apk upgrade --update-cache --available \
    && apk add --update --no-cache ca-certificates libzip curl tar xz openssl git mysql-client openssh-client pcre gmp imagemagick icu libmcrypt


RUN set -eux \
    && apk --no-cache add shadow \
    && apk add --no-cache $PHP_DEPS \
    && docker-php-ext-install -j$(nproc) bcmath zip gmp pdo_mysql opcache pcntl intl \
    && pecl channel-update pecl.php.net \
    && printf "\n" | pecl install imagick mcrypt apcu xdebug \
    && docker-php-ext-enable imagick mcrypt apcu xdebug \
    && apk del --purge $PHP_DEPS \
    && rm -vrf /var/cache/apk/* \
    && php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --filename=composer --install-dir=/usr/bin \
    && php -r "unlink('composer-setup.php');"

RUN usermod -u $UID www-data \
    && groupmod -g $GID www-data

USER www-data

EXPOSE 9000

CMD ["php-fpm", "-R"]