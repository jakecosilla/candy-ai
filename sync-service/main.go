package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/lib/pq"
	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/worker"
	"go.temporal.io/sdk/workflow"
)

type GreenhouseJob struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Location struct {
		Name string `json:"name"`
	} `json:"location"`
	Departments []struct {
		Name string `json:"name"`
	} `json:"departments"`
	Content string `json:"content"`
	Active  bool   `json:"active"`
}

type GreenhouseResponse struct {
	Jobs []GreenhouseJob `json:"jobs"`
}

// FetchJobsActivity connects to Greenhouse API
func FetchJobsActivity(ctx context.Context) ([]GreenhouseJob, error) {
	boardToken := os.Getenv("GREENHOUSE_BOARD_TOKEN")
	if boardToken == "" {
		boardToken = "antigravity" // default mock
	}
	
	url := fmt.Sprintf("https://boards-api.greenhouse.io/v1/boards/%s/jobs?content=true", boardToken)
	
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Greenhouse API returned %d", resp.StatusCode)
	}

	var parsed GreenhouseResponse
	if err := json.NewDecoder(resp.Body).Decode(&parsed); err != nil {
		return nil, err
	}
	
	// Ensure active jobs mapping
	var validJobs []GreenhouseJob
	for _, j := range parsed.Jobs {
		j.Active = true // assuming fetched = active on API
		validJobs = append(validJobs, j)
	}
	return validJobs, nil
}

// UpsertPostgresActivity commits synced data
func UpsertPostgresActivity(ctx context.Context, jobs []GreenhouseJob) error {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://candy:password@localhost:5432/candy_ai?sslmode=disable"
	}
	
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return err
	}
	defer db.Close()

	// 1. Mark all current jobs as inactive to catch "closed" jobs
	_, err = db.Exec("UPDATE jobs SET is_active = FALSE")
	if err != nil {
		return err
	}

	// 2. Upsert parsed jobs
	for _, job := range jobs {
		department := ""
		if len(job.Departments) > 0 {
			department = job.Departments[0].Name
		}
		
		_, err := db.Exec(`
			INSERT INTO jobs (id, title, department, location, type, description, is_active, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW())
			ON CONFLICT (id) DO UPDATE SET
				title = EXCLUDED.title,
				department = EXCLUDED.department,
				location = EXCLUDED.location,
				description = EXCLUDED.description,
				is_active = TRUE,
				updated_at = NOW()
		`, fmt.Sprintf("%d", job.ID), job.Title, department, job.Location.Name, "Full-time", job.Content)
		
		if err != nil {
			log.Printf("Failed to upsert job %d: %v", job.ID, err)
		}
	}

	// 3. Log Sync Run
	_, _ = db.Exec("INSERT INTO sync_runs (start_time, end_time, status, jobs_processed) VALUES (NOW(), NOW(), 'SUCCESS', $1)", len(jobs))
	return nil
}

// GreenhouseSyncWorkflow is the durable orchestrator
func GreenhouseSyncWorkflow(ctx workflow.Context) error {
	ao := workflow.ActivityOptions{
		StartToCloseTimeout: 1 * time.Minute,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	logger := workflow.GetLogger(ctx)
	logger.Info("Starting Greenhouse job sync workflow.")

	var apiJobs []GreenhouseJob
	err := workflow.ExecuteActivity(ctx, FetchJobsActivity).Get(ctx, &apiJobs)
	if err != nil {
		logger.Error("Greenhouse fetch failed", "Error", err)
		return err
	}

	err = workflow.ExecuteActivity(ctx, UpsertPostgresActivity, apiJobs).Get(ctx, nil)
	if err != nil {
		logger.Error("Postgres upsert failed", "Error", err)
		return err
	}

	logger.Info("Workflow completed successfully.")
	return nil
}

func main() {
	c, err := client.Dial(client.Options{
		HostPort: client.DefaultHostPort, // Or your remote Temporal endpoint
	})
	if err != nil {
		log.Fatalln("Unable to create client", err)
	}
	defer c.Close()

	w := worker.New(c, "greenhouse-sync-queue", worker.Options{})
	
	w.RegisterWorkflow(GreenhouseSyncWorkflow)
	w.RegisterActivity(FetchJobsActivity)
	w.RegisterActivity(UpsertPostgresActivity)

	// Since we are mocking production worker boot up
	fmt.Println("Starting Temporal Worker...")
	err = w.Run(worker.InterruptCh())
	if err != nil {
		log.Fatalln("Unable to start worker", err)
	}
}
