CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE jobs (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    location VARCHAR(255),
    type VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sync_runs (
    id SERIAL PRIMARY KEY,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50),
    jobs_processed INT,
    error_log TEXT
);

CREATE TABLE sync_run_errors (
    id SERIAL PRIMARY KEY,
    sync_run_id INT REFERENCES sync_runs(id) ON DELETE CASCADE,
    error_message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE knowledge_documents (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(1536),
    source_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
