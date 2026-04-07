package temporal

import (
	"time"

	"candy-ai/sync-service/internal/models"
	"go.temporal.io/sdk/workflow"
)

func GreenhouseSyncWorkflow(ctx workflow.Context) error {
	ao := workflow.ActivityOptions{
		StartToCloseTimeout: 1 * time.Minute,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	logger := workflow.GetLogger(ctx)
	logger.Info("Starting Greenhouse job sync workflow.")

	var activities *SyncActivities

	var apiJobs []models.GreenhouseJob
	err := workflow.ExecuteActivity(ctx, activities.FetchJobsActivity).Get(ctx, &apiJobs)
	if err != nil {
		logger.Error("Greenhouse fetch failed", "Error", err)
		return err
	}

	err = workflow.ExecuteActivity(ctx, activities.UpsertPostgresActivity, apiJobs).Get(ctx, nil)
	if err != nil {
		logger.Error("Postgres upsert failed", "Error", err)
		return err
	}

	logger.Info("Workflow completed successfully.")
	return nil
}
