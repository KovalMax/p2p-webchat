FROM php:8.1-fpm-alpine3.16

ENV PHP_DEPS build-base autoconf curl-dev gmp-dev libpng-dev libxml2-dev libmcrypt-dev imagemagick-dev icu-dev libzip-dev
ENV APP_DEPS ca-certificates libzip curl tar xz openssl git openssh-client pcre gmp imagemagick icu libmcrypt libsodium-dev postgresql-dev

ARG UID=1000
ARG GID=1000
ARG FPM_USER_NAME=www-data
ARG XDEBUG=1
ARG JWT_KEY_PATH=/secret/path
ARG JWT_KEY_PASS=secret

RUN mkdir -p $JWT_KEY_PATH

WORKDIR /var/www

COPY ./config/xdebug.ini $PHP_INI_DIR/conf.d
COPY ./config/opcache_preload.ini $PHP_INI_DIR/conf.d

RUN apk update \
    && apk upgrade --update-cache --available \
    && apk add --update --no-cache $APP_DEPS \
    && apk --no-cache add shadow \
    && apk add --no-cache $PHP_DEPS

RUN docker-php-ext-install -j$(nproc) bcmath zip gmp pdo pdo_pgsql opcache pcntl intl \
    && pecl channel-update pecl.php.net \
    && printf "\n" | pecl install mcrypt apcu xdebug libsodium \
    && docker-php-ext-enable mcrypt apcu

RUN apk del --purge $PHP_DEPS \
    && rm -vrf /var/cache/apk/*

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --filename=composer --install-dir=/usr/bin \
    && php -r "unlink('composer-setup.php');"

RUN openssl genrsa -passout pass:$JWT_KEY_PASS -out $JWT_KEY_PATH/private.pem -aes256 512 \
    && openssl rsa -pubout -in $JWT_KEY_PATH/private.pem -passin pass:$JWT_KEY_PASS -out $JWT_KEY_PATH/public.pem \
    && chmod -R a+r $JWT_KEY_PATH

RUN usermod -ou $UID $FPM_USER_NAME
RUN groupmod -og $GID $FPM_USER_NAME

USER $FPM_USER_NAME

EXPOSE 9000

CMD ["php-fpm"]
