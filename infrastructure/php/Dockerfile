FROM php:7.4-fpm-alpine3.11

ENV PHP_DEPS build-base autoconf curl-dev gmp-dev libpng-dev libxml2-dev libmcrypt-dev imagemagick-dev icu-dev libzip-dev
ENV APP_DEPS ca-certificates libzip curl tar xz openssl git openssh-client pcre gmp imagemagick icu libmcrypt postgresql-dev

ARG UID=1000
ARG GID=1000
ARG FPM_USER_NAME=www-data
ARG XDEBUG=1

WORKDIR /var/www

COPY ./config/xdebug.ini $PHP_INI_DIR/conf.d
COPY ./config/opcache_preload.ini $PHP_INI_DIR/conf.d

RUN apk update \
    && apk upgrade --update-cache --available \
    && apk add --update --no-cache $APP_DEPS


RUN apk --no-cache add shadow \
    && apk add --no-cache $PHP_DEPS \
    && docker-php-ext-install -j$(nproc) bcmath zip gmp pdo pdo_pgsql opcache pcntl intl \
    && pecl channel-update pecl.php.net \
    && printf "\n" | pecl install imagick mcrypt apcu xdebug \
    && docker-php-ext-enable imagick mcrypt apcu xdebug \
    && apk del --purge $PHP_DEPS \
    && rm -vrf /var/cache/apk/* \
    && php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --filename=composer --install-dir=/usr/bin \
    && php -r "unlink('composer-setup.php');"

RUN usermod -u $UID $FPM_USER_NAME && groupmod -g $GID $FPM_USER_NAME

USER $FPM_USER_NAME

EXPOSE 9000

CMD ["php-fpm", "-R"]