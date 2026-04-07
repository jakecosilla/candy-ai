package temporal

import (
	"context"

	"candy-ai/sync-service/internal/models"
	"candy-ai/sync-service/internal/repository"
	"candy-ai/sync-service/internal/service"
)

type SyncActivities struct {
	ghService *service.GreenhouseService
	repo      *repository.JobRepository
}

func NewSyncActivities(gh *service.GreenhouseService, repo *repository.JobRepository) *SyncActivities {
	return &SyncActivities{
		ghService: gh,
		repo:      repo,
	}
}

func (a *SyncActivities) FetchJobsActivity(ctx context.Context) ([]models.GreenhouseJob, error) {
	return a.ghService.FetchJobs(ctx)
}

func (a *SyncActivities) UpsertPostgresActivity(ctx context.Context, jobs []models.GreenhouseJob) error {
	return a.repo.SyncJobs(ctx, jobs)
}
