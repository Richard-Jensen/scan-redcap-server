# Requirements

* PHP 7.2
* Composer
* PostgreSQL or MySQL
* Node
* Yarn

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
