FROM php:7.3-fpm-stretch

RUN apt-get update && \
    apt-get install --no-install-recommends -y supervisor python-pip \
        python-setuptools python-wheel  nginx && \
    pip install supervisor-stdout && \
    mkdir -p /var/log/supervisor && \
    docker-php-ext-install -j$(nproc) pdo mysqli pdo_mysql && \
    chmod -R 777 /dystillweb/bootstrap/cache && \
    groupadd -g 9000 dystillweb && \
    useradd -u 9000 -ms /bin/bash -g dystillweb dystillweb && \
    chmod -R 777 /dystillweb/storage && \
    chown -R dystillweb:dystillweb /dystillweb

COPY ./docker/config/supervisor.conf /etc/supervisor/conf.d/
COPY ./docker/config/supervisord.conf /etc/supervisor/supervisord.conf
COPY ./docker/config/nginx.conf /etc/nginx/sites-enabled/default
EXPOSE 80
CMD ["/usr/bin/supervisord", "-n"]
