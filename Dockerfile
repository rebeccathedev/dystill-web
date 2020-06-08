FROM php:7.4-fpm-buster
WORKDIR /dystill-web
COPY ./build /dystill-web/app
RUN apt-get update && \
    apt-get install -y libc-client-dev libkrb5-dev && \
    rm -r /var/lib/apt/lists/* && \
    docker-php-ext-configure imap --with-kerberos --with-imap-ssl && \
    docker-php-ext-install imap && \
    chmod -R 777 /dystill-web/app/storage

EXPOSE 80
