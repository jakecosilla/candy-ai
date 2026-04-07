package service

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"candy-ai/sync-service/internal/models"
)

type GreenhouseService struct {
	token  string
	client *http.Client
}

func NewGreenhouseService(token string) *GreenhouseService {
	return &GreenhouseService{
		token: token,
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (s *GreenhouseService) FetchJobs(ctx context.Context) ([]models.GreenhouseJob, error) {
	if s.token == "" {
		return nil, fmt.Errorf("GREENHOUSE_BOARD_TOKEN environment variable not set")
	}

	url := fmt.Sprintf("https://boards-api.greenhouse.io/v1/boards/%s/jobs?content=true", s.token)
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Greenhouse API returned %d", resp.StatusCode)
	}

	var parsed models.GreenhouseResponse
	if err := json.NewDecoder(resp.Body).Decode(&parsed); err != nil {
		return nil, err
	}

	var validJobs []models.GreenhouseJob
	for _, j := range parsed.Jobs {
		j.Active = true
		validJobs = append(validJobs, j)
	}
	return validJobs, nil
}
