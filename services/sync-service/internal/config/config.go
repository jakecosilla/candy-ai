package config

import "os"

type Config struct {
	TemporalHost    string
	DBURL           string
	GreenhouseToken string
}

func Load() *Config {
	temporalHost := os.Getenv("TEMPORAL_HOST")
	if temporalHost == "" {
		temporalHost = "localhost:7233"
	}
	return &Config{
		TemporalHost:    temporalHost,
		DBURL:           os.Getenv("DATABASE_URL"),
		GreenhouseToken: os.Getenv("GREENHOUSE_BOARD_TOKEN"),
	}
}
