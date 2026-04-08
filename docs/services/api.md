# Candy AI Backend (Node.js)

BFF (Backend-for-Frontend) layer managing request orchestration, CMS data aggregation, and workflow triggering.

## Key Features
- **Express 5.0 Router**: High-performance, async-native routing.
- **Zod Validation**: Strict schema-based request validation middleare.
- **Graceful Shutdown**: SIGTERM/SIGINT listeners for safe database pool drainage.
- **Structured Logging**: Winston-based JSON logging for production observability.

## Local Setup
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Setup Env**: Create a `.env` in this directory (see root `.env.example`).
3. **Run Dev**: 
   ```bash
   npm run dev
   ```

## Development
- **Build**: `npm run build`
- **Test**: `npm test`
