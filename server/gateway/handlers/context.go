package handlers

import (
	"assignments-fixed-Lyonsupernova/servers/gateway/models/users"
	"assignments-fixed-Lyonsupernova/servers/gateway/sessions"
)

//TODO: define a handler context struct that
//will be a receiver on any of your HTTP
//handler functions that need access to
//globals, such as the key used for signing
//and verifying SessionIDs, the session store
//and the user store

// ContextHandler deals with the session id,
// the store of session and user
type ContextHandler struct {
	SessionID    string
	SessionStore sessions.Store
	UserStore    users.Store
}
