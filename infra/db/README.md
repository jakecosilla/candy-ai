# Database Schema & Migrations

This folder acts as the single source of truth for the shared PostgreSQL cluster schema.
Since both the `api` (reads mostly) and `sync-service` (writes jobs continuously) require overlapping structural contexts, we decouple the schema lifecycle from individual Go/Python codebases. 

## Migration Strategy
- Powered by [golang-migrate/migrate](https://github.com/golang-migrate/migrate).
- Automatically executes via the `db-migrator` service in `docker-compose.yml`.
- Schema evolution is additive by default (using `UP`/`DOWN` `.sql` pairs) allowing backward/forward safety.

## Verifying Migrations in CI
A provided bash script guarantees valid semantics incrementally. 
In your GitHub Actions (or similar CI environments), execute from the root directory:
```bash
$ ./infra/db/test_migrations.sh
```
This isolates an ephemeral Postgres container and explicitly steps `up -> down -> up` to prevent locked configurations.
