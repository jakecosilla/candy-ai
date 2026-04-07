#!/bin/bash
set -e

echo "Standing up temporary Postgres..."
docker run --name pg-mig-test -e POSTGRES_USER=candy -e POSTGRES_PASSWORD=password -e POSTGRES_DB=candy_ai -p 5434:5432 -d pgvector/pgvector:15
sleep 3

echo "Running UP migrations..."
docker run --rm -v $(pwd)/infra/db/migrations:/migrations --network host migrate/migrate -path /migrations -database "postgres://candy:password@localhost:5434/candy_ai?sslmode=disable" up

echo "Running DOWN migrations..."
docker run --rm -v $(pwd)/infra/db/migrations:/migrations --network host migrate/migrate -path /migrations -database "postgres://candy:password@localhost:5434/candy_ai?sslmode=disable" down -all

echo "Running UP migrations again..."
docker run --rm -v $(pwd)/infra/db/migrations:/migrations --network host migrate/migrate -path /migrations -database "postgres://candy:password@localhost:5434/candy_ai?sslmode=disable" up

docker rm -f pg-mig-test
echo "Migration tests completed successfully!"
