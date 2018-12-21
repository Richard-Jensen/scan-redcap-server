# Requirements

* PHP 7.2
* Composer
* PostgreSQL or MySQL
* Node
* Yarn

## For future server installations

## Deployment to a remote server

Use ssh to access the server, and run step 1-4. In step 2, make sure the .env file fits the server specs. For deployment to scan.glaux.dk specifically, remember to add the lines
LETSENCRYPT_EMAIL=richjn@rm.dk
LETSENCRYPT_HOST=scan.glaux.dk,www.scan.glaux.dk
VIRTUAL_HOST=scan.glaux.dk,www.scan.glaux.dk
at the end of the file. 

Next, change the docker-compose.yaml file in the root. You want to delete the mySQL dependencies, and in the end, the file should look something like this:

version: '3.3'

services:

  app:
    image: funklid/scan-redcap
    build: .
    container_name: scan-redcap
    env_file:
      - .env
        # ports:
            #  - "4321:80"
    expose:
      - "80"
    volumes:
      - .:/var/www/html

  #phpmyadmin:
  #  image: phpmyadmin/phpmyadmin:4.7
  #  # volumes:
  #  #   - ./docker/phpmyadmin/config.user.inc.php:/etc/phpmyadmin/config.user.inc.php
  #  env_file:
  #    - .env
  #  #ports:
  #  #  - "5432:80"
  #  depends_on:
  #    - mysql

networks:
  default:
    external:
      name: webproxy
 #https://github.com/evertramos/docker-compose-letsencrypt-nginx-proxy-companion

Next, in /app/providers, change add the line \URL::forceScheme('https'); to the function boot(). This will make sure that all http:// will become https://. 


## Local installation

For MacOS setup use [Valet](https://laravel.com/docs/5.6/valet)

#### 1. Install PHP dependencies

```sh
composer install
```

#### 2. Set environment variables

Create a `.env` file in the root or copy `.env.example` to `.env`.

Make sure you have an empty database and set your local database credentials in the `.env` file.

Set the external database (REDCap) url:

```
REDCAP_URL=https://redcap.au.dk/api/
```

#### 3. Set encryption key

```sh
php artisan key:generate
```

#### 4. Run migrations

```sh
php artisan migrate
```

#### 5. Install front end dependencies and start the webpack server

```sh
yarn && yarn watch
```

#### 6. Go to the root of your server

`localhost` or `scan-app.test` or where your local server serves your files.

### Running commands on Heroku

When pushing to a Heroku app composer installs all the necessary dependencies automatically.

Environment variables are setup through `https://dashboard.heroku.com/apps/{app-name}/settings`

Make sure to have a Heroku PostgreSQL addon installed (`https://dashboard.heroku.com/apps/{app-name}/resources`)

Heroku commands:

```sh
# Run pending migrations
heroku run php artisan migrate --app={app-name}
```
