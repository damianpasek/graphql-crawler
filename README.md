# graphql-crawler

GraphQL API with website anchor links crawler

## Installation

```
$ yarn install
```

## Usage

Starting development sever
```
$ yarn dev
```

Building project
```
$ yarn build
```

## Database

Project contains `docker-compose.yml` file so to run database you need to run command
```
$ docker-compose up
```

To run migrations:
```
$ yarn typeorm:cli migration:run
```

### Tests and Linting

```
$ yarn test
$ yarn lint
```
