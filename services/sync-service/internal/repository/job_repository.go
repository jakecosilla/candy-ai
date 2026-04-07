package repository

import (
	"context"
	"database/sql"
	"fmt"

	"candy-ai/sync-service/internal/models"
)

type JobRepository struct {
	db *sql.DB
}

func NewJobRepository(db *sql.DB) *JobRepository {
	return &JobRepository{db: db}
}

func (r *JobRepository) SyncJobs(ctx context.Context, jobs []models.GreenhouseJob) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("start tx failed: %w", err)
	}
	defer tx.Rollback()

	_, err = tx.ExecContext(ctx, "UPDATE jobs SET is_active = FALSE")
	if err != nil {
		return fmt.Errorf("mark inactive failed: %w", err)
	}

	queryUpsertJob := `
		INSERT INTO jobs (id, title, department, location, type, description, is_active, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW())
		ON CONFLICT (id) DO UPDATE SET
			title = EXCLUDED.title,
			department = EXCLUDED.department,
			location = EXCLUDED.location,
			description = EXCLUDED.description,
			is_active = TRUE,
			updated_at = NOW()
	`
	for _, job := range jobs {
		department := ""
		if len(job.Departments) > 0 {
			department = job.Departments[0].Name
		}
		_, err := tx.ExecContext(ctx, queryUpsertJob,
			fmt.Sprintf("%d", job.ID), job.Title, department, job.Location.Name, "Full-time", job.Content)
		if err != nil {
			return fmt.Errorf("upsert job %d failed: %w", job.ID, err)
		}
	}

	_, err = tx.ExecContext(ctx, "INSERT INTO sync_runs (start_time, end_time, status, jobs_processed) VALUES (NOW(), NOW(), 'SUCCESS', $1)", len(jobs))
	if err != nil {
		return fmt.Errorf("insert sync run failed: %w", err)
	}

	return tx.Commit()
}
