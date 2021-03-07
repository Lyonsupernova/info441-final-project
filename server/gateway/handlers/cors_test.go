package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestServeHTTP(t *testing.T) {

	newHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {})
	server := httptest.NewServer(NewHeaderHandler(newHandler))
	req, _ := http.Get(string(server.URL))

	cases := []struct {
		key           string
		expectedValue string
	}{
		{
			"Access-Control-Allow-Origin",
			"*",
		},
		{
			"Access-Control-Allow-Methods",
			"GET, PUT, POST, PATCH, DELETE",
		},
		{
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization",
		},
		{
			"Access-Control-Expose-Headers",
			"Authorization",
		},
		{
			"Access-Control-Max-Age",
			"600",
		},
	}

	for _, ca := range cases {
		value := req.Header.Get(ca.key)
		if value != ca.expectedValue {
			t.Errorf("%v has incorrect output, expected value: %s, Actual Value %s", ca.key, ca.expectedValue, value)
		}
	}

}
