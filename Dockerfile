FROM php:7.4-fpm-buster
WORKDIR /dystill-web
COPY ./build /dystill-web/app
RUN apt-get update && \
    apt-get install -y libc-client-dev libkrb5-dev && \
    rm -r /var/lib/apt/lists/* && \
    docker-php-ext-configure imap --with-kerberos --with-imap-ssl && \
    docker-php-ext-install -j$(nproc) imap pdo mysqli pdo_mysql && \
    chmod -R 777 /dystill-web/app/bootstrap/cache && \
    groupadd -g 9000 dystill && \
    useradd -u 9000 -ms /bin/bash -g dystill dystill && \
    chmod -R 777 /dystill-web/app/storage && \
    chown -R dystill:dystill /dystill-web/app && \
    rm -rf /dystill-web/app/.env

EXPOSE 80
