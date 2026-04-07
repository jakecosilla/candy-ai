package models

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
