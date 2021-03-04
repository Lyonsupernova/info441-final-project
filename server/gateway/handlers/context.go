package handlers

import (
	"info441-final-project/server/gateway/models/users"
	"info441-final-project/server/gateway/sessions"
)

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
