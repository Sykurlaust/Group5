# Backend Skeleton

This directory hosts the future API for the project. Suggested layout:

- `src/config`: environment variables, database connections, and shared constants.
- `src/routes`: HTTP route registrations.
- `src/controllers`: request handlers that orchestrate workflows.
- `src/services`: domain logic, third-party integrations, and reusable operations.
- `src/models`: ORM schemas or validation models.
- `src/middlewares`: Express/Koa middleware such as auth or logging.
- `src/utils`: small, framework-agnostic helpers.
- `src/tests`: unit/integration tests for the backend modules.

Add a `package.json`, `tsconfig.json`, and `.env.example` when you initialize the backend runtime (Express, Nest, etc.).
