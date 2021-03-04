package handlers

import (
	"assignments-fixed-Lyonsupernova/servers/gateway/models/users"
	"time"
)

//TODO: define a session state struct for this web server
//see the assignment description for the fields you should include
//remember that other packages can only see exported fields!

// SessionState stores the begin time and users information
type SessionState struct {
	BeginDate time.Time   `json:"startTime"`
	User      *users.User `json:"user"`
}
