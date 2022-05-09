# REST Api Project

Node and postgres data base with jasmine test Developed using VSCode in windows
WSL

## PreRequest

```sh
npm install -g db-migrate
```

## Docker

```sh
docker-compose up
```

## No-Docker

create user with name postgres and password as postgres and database with name
"my_db"

## Test

```sh
npm run test
```

command create database then run migrations and run jasmine test and finally
drop migration and database

## Development

create database if not created

```sh
npm run dev_create
```

Run project:

```sh
npm run dev
```

You can use postman by importing json file from postman folder into postman
Application.
