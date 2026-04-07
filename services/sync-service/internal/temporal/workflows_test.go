package temporal

import (
	"testing"

	"candy-ai/sync-service/internal/models"
	"github.com/stretchr/testify/mock"
	"go.temporal.io/sdk/testsuite"
)

func TestGreenhouseSyncWorkflow(t *testing.T) {
	testSuite := &testsuite.WorkflowTestSuite{}
	env := testSuite.NewTestWorkflowEnvironment()

	var activities *SyncActivities

	jobs := []models.GreenhouseJob{
		{ID: 1, Title: "Engineer", Active: true},
	}

	env.OnActivity(activities.FetchJobsActivity, mock.Anything).Return(jobs, nil)
	env.OnActivity(activities.UpsertPostgresActivity, mock.Anything, jobs).Return(nil)

	env.ExecuteWorkflow(GreenhouseSyncWorkflow)
	
	err := env.GetWorkflowError()
	if err != nil {
		t.Fatalf("Workflow execution failed: %v", err)
	}

	env.AssertExpectations(t)
}
