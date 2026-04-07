package service

import (
	"context"
	"io"
	"net/http"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

type roundTripperFunc func(*http.Request) (*http.Response, error)

func (fn roundTripperFunc) RoundTrip(req *http.Request) (*http.Response, error) { return fn(req) }

func TestFetchJobs(t *testing.T) {
	svc := NewGreenhouseService("test-token")
	svc.client.Transport = roundTripperFunc(func(req *http.Request) (*http.Response, error) {
		assert.Equal(t, "boards-api.greenhouse.io", req.URL.Host)
		
		return &http.Response{
			StatusCode: 200,
			Body:       io.NopCloser(strings.NewReader(`{"jobs": [{"id": 1, "title": "SE"}]}`)),
		}, nil
	})

	jobs, err := svc.FetchJobs(context.Background())
	assert.NoError(t, err)
	assert.Len(t, jobs, 1)
	assert.Equal(t, "SE", jobs[0].Title)
}
