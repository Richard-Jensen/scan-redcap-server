# from https://www.drupal.org/requirements/php#drupalversions
FROM php:7.2-apache

# Activate the rewrite_module
# RUN set -ex; \
#     \
#     if command -v a2enmod; then \
#       a2enmod rewrite; \
#     fi; \
#     \
#     savedAptMark="$(apt-mark showmanual)";
RUN a2enmod rewrite

# Install packages
RUN rm /bin/sh && ln -s /bin/bash /bin/sh && \
    apt-get update && apt-get install --no-install-recommends -y \
      libjpeg-dev \
      libpng-dev \
      libpq-dev \
      curl \
      wget \
      vim \
      git \
      unzip \
      mysql-client \
    ;

# Install PHP extensions
# RUN docker-php-ext-install \
#     mcrypt

# From the official docker image
RUN docker-php-ext-configure gd --with-png-dir=/usr --with-jpeg-dir=/usr; \
    docker-php-ext-install -j "$(nproc)" \
      gd \
      opcache \
      pdo_mysql \
      pdo_pgsql \
      zip \
    ;
# reset apt-mark's "manual" list so that "purge --auto-remove" will remove all build dependencies
# RUN apt-mark auto '.*' > /dev/null; \
#     apt-mark manual $savedAptMark; \
#     ldd "$(php -r 'echo ini_get("extension_dir");')"/*.so \
#       | awk '/=>/ { print $3 }' \
#       | sort -u \
#       | xargs -r dpkg-query -S \
#       | cut -d: -f1 \
#       | sort -u \
#       | xargs -rt apt-mark manual; \
#     \
#     apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
#     rm -rf /var/lib/apt/lists/*

# Clean repository
RUN apt-get clean && rm -rf /var/lib/apt/lists/*







WORKDIR /var/www/html

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer && \
    ln -s /root/.composer/vendor/bin/drush /usr/local/bin/drush

# COPY public_html /var/www/html/

COPY scan-apache.conf /etc/apache2/sites-enabled/scan-apache.conf
