package config

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestLoadConfig(t *testing.T) {
	os.Setenv("TEMPORAL_HOST", "test:7233")
	os.Setenv("DATABASE_URL", "postgres://test")
	os.Setenv("GREENHOUSE_BOARD_TOKEN", "test-token")
	
	defer os.Clearenv()

	cfg := Load()
	assert.Equal(t, "test:7233", cfg.TemporalHost)
	assert.Equal(t, "postgres://test", cfg.DBURL)
	assert.Equal(t, "test-token", cfg.GreenhouseToken)
}

func TestLoadConfigDefault(t *testing.T) {
	os.Clearenv()
	cfg := Load()
	assert.Equal(t, "localhost:7233", cfg.TemporalHost)
}
