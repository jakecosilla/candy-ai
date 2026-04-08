package main

import (
	"log/slog"
	"os"

	"candy-ai/sync-service/internal/config"
	"candy-ai/sync-service/internal/db"
	"candy-ai/sync-service/internal/repository"
	"candy-ai/sync-service/internal/service"
	appTemporal "candy-ai/sync-service/internal/temporal"

	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/worker"
)




func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	cfg := config.Load()
	logger.Info("Starting Sync Service", "temporal_host", cfg.TemporalHost)

	// DB connection
	database, err := db.InitDB(cfg.DBURL)
	if err != nil {
		logger.Error("Failed to initialize database", "err", err)
		os.Exit(1)
	}
	defer database.Close()

	// Initialize dependencies
	ghService := service.NewGreenhouseService(cfg.GreenhouseToken)
	jobRepo := repository.NewJobRepository(database)
	activities := appTemporal.NewSyncActivities(ghService, jobRepo)

	// Temporal Client
	c, err := client.Dial(client.Options{
		HostPort: cfg.TemporalHost,
	})
	if err != nil {
		logger.Error("Unable to create temporal client", "err", err)
		os.Exit(1)
	}
	defer c.Close()

	w := worker.New(c, "greenhouse-sync-queue", worker.Options{})

	w.RegisterWorkflow(appTemporal.GreenhouseSyncWorkflow)
	w.RegisterActivity(activities.FetchJobsActivity)
	w.RegisterActivity(activities.UpsertPostgresActivity)

	logger.Info("Starting Temporal Worker...")
	if err := w.Run(worker.InterruptCh()); err != nil {
		logger.Error("Worker run failed", "err", err)
		os.Exit(1)
	}
}
