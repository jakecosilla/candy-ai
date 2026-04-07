package repository

import (
	"context"
	"testing"

	"candy-ai/sync-service/internal/models"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestSyncJobs(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := NewJobRepository(db)

	jobs := []models.GreenhouseJob{
		{
			ID:      1,
			Title:   "Engineer",
			Content: "Code",
		},
	}

	mock.ExpectBegin()
	mock.ExpectExec("UPDATE jobs SET is_active = FALSE").WillReturnResult(sqlmock.NewResult(0, 1))
	// Because of text spacing in query string we map any whitespace
	mock.ExpectExec(`INSERT INTO jobs`).WithArgs("1", "Engineer", "", "", "Full-time", "Code").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectExec(`INSERT INTO sync_runs`).WithArgs(1).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	err = repo.SyncJobs(context.Background(), jobs)
	assert.NoError(t, err)
	err = mock.ExpectationsWereMet()
	assert.NoError(t, err)
}
