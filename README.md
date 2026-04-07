# Storefront Backend API

This project is a RESTful API built with Node.js, Express, and PostgreSQL, designed to support an online storefront. It provides endpoints for managing users, products, categories, and orders, including authentication and authorization using JSON Web Tokens (JWT).

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **PostgreSQL**: Robust, open-source relational database.
- **TypeScript**: Typed superset of JavaScript for enhanced developer experience and code quality.
- **Jasmine**: BDD-style testing framework.
- **db-migrate**: Database migration tool for PostgreSQL.
- **Docker**: Containerization platform for consistent development environments.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [Docker](https://www.docker.com/) (optional, for running the database)
- [PostgreSQL](https://www.postgresql.org/) (if not using Docker)
- [db-migrate](https://db-migrate.readthedocs.io/en/latest/) (installed globally: `npm install -g db-migrate`)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd rest_api_store_postgres_express
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and configure the following variables (refer to `.env.example` if available, or use the list below):

| Variable | Description | Default/Example |
| :--- | :--- | :--- |
| `PORT` | Port for the Express server | `4000` |
| `ENV` | Environment (dev, test) | `dev` |
| `POSTGRES_HOST` | Database host | `127.0.0.1` |
| `POSTGRES_USER` | Database user | `postgres` |
| `POSTGRES_PASSWORD` | Database password | `postgres` |
| `POSTGRES_DB` | Development database name | `my_db` |
| `POSTGRES_TEST_DB` | Test database name | `test_db` |
| `DB_PORT` | Database port | `5432` |
| `SALT_ROUNDS` | Rounds for bcrypt hashing | `10` |
| `APP_SECRET_KEY` | Secret key for JWT signing | `your_secret_key` |
| `JWT_EXPIRATION` | JWT token expiration time | `24h` |

### 3. Database Setup

#### Using Docker (Recommended)

1. Start the PostgreSQL container:
   ```bash
   docker-compose up -d
   ```
2. Create the development database:
   ```bash
   npm run dev_create
   ```
3. Run migrations:
   ```bash
   npm run dev-db-up
   ```

#### Without Docker

1. Ensure PostgreSQL is running on your machine.
2. Create a database named `my_db` and `test_db` for development and testing respectively.
3. Update your `.env` file with your local database credentials.
4. Run migrations:
   ```bash
   npm run dev-db-up
   ```

### 4. Installation and Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server (with watch mode):
   ```bash
   npm run dev
   ```
   The server will be running at `http://localhost:4000/api`.

## Available Scripts

- `npm run dev`: Starts the development server with migrations and watch mode.
- `npm run build`: Cleans the `dist` folder and compiles TypeScript to JavaScript.
- `npm run test`: Creates the test database, runs migrations, executes Jasmine tests, and drops the test database.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run prettier-format`: Formats the codebase using Prettier.

## API Documentation

The API provides endpoints for:
- **Users**: Registration, Index, and Show.
- **Products**: Index, Show, Create, and Delete.
- **Categories**: Index, Show, Create, and Delete.
- **Orders**: Index, Show, Create, and Delete.

For detailed information on endpoints, request/response shapes, and authentication requirements, please refer to the [REQUIREMENTS.md](./REQUIREMENTS.md) file.

### Postman Collection

A Postman collection is available in the `postman_api/` directory to help you test the API endpoints.

## Contributing

This project is open for contributions. Please ensure that:
1. Your code follows the project's linting and formatting rules.
2. You write tests for any new features or bug fixes.
3. All tests pass before submitting a pull request.
