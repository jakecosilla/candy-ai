# Candy Sync Service (Go)

Durable synchronization engine for ATS (Greenhouse) data and system-wide background tasks.

## Key Features
- **Temporal Worker**: Orchestrates complex Greenhouse sync workflows.
- **Transactional Upserts**: Ensures data consistency even during concurrent executions.
- **Inventory Sync**: Automatically manages job status (active/inactive) based on ATS state.

## Local Setup
1. **Download Deps**:
   ```bash
   go mod tidy
   ```
2. **Run Service**:
   ```bash
   go run main.go
   ```

## Development
- **Testing**: `go test ./... -v`
- **Linting**: Standard `gofmt` and `staticcheck`.
