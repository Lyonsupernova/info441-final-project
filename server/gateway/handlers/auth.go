package handlers

import (
	"encoding/json"
	"info441-final-project/server/gateway/models/users"
	"info441-final-project/server/gateway/sessions"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

// UsersHandler handles the request
func (ch *ContextHandler) UsersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "The request method is not legal", http.StatusMethodNotAllowed)
		return
	}
	contentType := r.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "application/json") {
		log.Printf("The request body must be in JSON %s", contentType)
		http.Error(w, "The request body must be in JSON", http.StatusUnsupportedMediaType)
		return
	}
	// usr type users.NewUser
	newUsr := &users.NewUser{}
	// err := json.NewDecoder(r.Body).Decode(newUsr)
	err := json.NewDecoder(r.Body).Decode(newUsr)
	if err != nil {
		log.Printf("error decoding JSON: %v\n", err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	// any of the validation rules fail
	if err := newUsr.Validate(); err != nil {
		log.Printf("validate user fails")
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	usr := &users.User{}
	// set usr as user from new user
	usr, err = newUsr.ToUser()
	if err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	insertUsr, err := ch.UserStore.Insert(usr)
	if err != nil {
		log.Printf("User database insert error %s", err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	// begin a session
	sessionState := &SessionState{
		BeginDate: time.Now(),
		User:      insertUsr,
	}
	_, err = sessions.BeginSession(ch.SessionID, ch.SessionStore, sessionState, w)
	if err != nil {
		log.Printf("Begin session error %s", err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	// writing response to the clients
	w.Header().Set("Content-Type", "application/json")
	// status code 201
	w.WriteHeader(http.StatusCreated)

	if err := json.NewEncoder(w).Encode(insertUsr); err != nil {
		log.Printf("User profile cannot be encoded in JSON format")
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
}

// SpecificUserHandler authenticate the user and get the seesion state
func (ch *ContextHandler) SpecificUserHandler(w http.ResponseWriter, r *http.Request) {
	// authenticate the user and get the session state
	auth := r.Header.Get("Authorization")
	sessionID := sessions.SessionID(strings.TrimPrefix(auth, "Bearer "))
	sessionState := &SessionState{}
	err := ch.SessionStore.Get(sessionID, sessionState)
	//_, err = sessions.GetSessionID(r, sessionID.String())
	if err != nil {
		log.Printf("sessionid errors")
		http.Error(w, "current sessionID is not valid", http.StatusUnauthorized)
		return
	}

	/*
		sessionState := &SessionState{}
		_, err = sessions.GetState(r, ch.SessionID, ch.SessionStore, sessionState)
		if err != nil {
			http.Error(w, "current session state is not valid", http.StatusUnauthorized)
			return
		}
	*/

	base := filepath.Base(r.URL.Path)
	if r.Method == http.MethodGet {
		// get the user profile from the url path last element
		var usr *users.User
		var err error
		if base == "me" {
			usr, err = ch.UserStore.GetByID(sessionState.User.ID)
		} else {
			userID, err2 := strconv.ParseInt(base, 10, 64)
			if err2 != nil {
				log.Printf("error is %v", err2)
				http.Error(w, "User ID format not valid", http.StatusNotFound)
			}
			usr, err = ch.UserStore.GetByID(userID)
		}
		if err != nil {
			log.Printf("error is%v", err)
			http.Error(w, "User ID not found in session store", http.StatusNotFound)
			return
		}
		// writing response to the clients
		w.Header().Set("Content-Type", "application/json")
		// status code 200
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(usr); err != nil {
			log.Printf("User profile cannot be encoded in JSON format")
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}
	} else if r.Method == http.MethodPatch {
		if base != "me" {
			userID, err := strconv.ParseInt(base, 10, 64)
			//log.Printf("%v", userID)
			if err != nil {
				http.Error(w, "User ID format not valid", http.StatusForbidden)
				return
			}
			_, err = ch.UserStore.GetByID(userID)
			if err != nil {
				log.Printf("The user is not authenticated")
				http.Error(w, "User ID not found in session store", http.StatusForbidden)
				return
			}
		}
		contentType := r.Header.Get("Content-Type")
		if !strings.HasPrefix(contentType, "application/json") {
			http.Error(w, "The request body must be in JSON", http.StatusUnsupportedMediaType)
			return
		}
		// update the current user profile with new profile
		newUsr := &users.Updates{}
		err := json.NewDecoder(r.Body).Decode(newUsr)
		if err != nil {
			log.Printf("error decoding JSON: %v\n", err)
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}
		updateUsr, err := ch.UserStore.Update(sessionState.User.ID, newUsr)
		if err != nil {
			log.Printf("updated failed")
			http.Error(w, "updated error found", http.StatusBadRequest)
			return
		}
		// writing response to the clients
		w.Header().Set("Content-Type", "application/json")
		// status code 200
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(updateUsr); err != nil {
			log.Printf("User profile cannot be encoded in JSON format")
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}
	} else {
		http.Error(w, "Error request method", http.StatusMethodNotAllowed)
	}
}

// SessionsHandler handles ...
func (ch *ContextHandler) SessionsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		contentType := r.Header.Get("Content-Type")
		if !strings.HasPrefix(contentType, "application/json") {
			log.Printf("The request body must be in JSON")
			http.Error(w, "Bad request", http.StatusUnsupportedMediaType)
			return
		}
		userCredential := &users.Credentials{}
		jsonResponseBody, _ := ioutil.ReadAll(r.Body)
		if err := json.Unmarshal(jsonResponseBody, userCredential); err != nil {
			log.Printf("The request body cannot be encoded")
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		// find the user profile
		user, err := ch.UserStore.GetByEmail(userCredential.Email)
		if err != nil {
			log.Printf("The user's profile cannot be found")
			http.Error(w, "Profile not found", http.StatusUnauthorized)
			return
		}

		// authentiicate
		//log.Printf("test: %s", userCredential.Password)
		if err := user.Authenticate(userCredential.Password); err != nil {
			log.Printf("The user's credential is not authentiated")
			http.Error(w, "Credential not authorized", http.StatusUnauthorized)
			return
		}

		// begin a new sessison
		_, err = sessions.BeginSession(ch.SessionID, ch.SessionStore, &SessionState{time.Now(), user}, w)
		if err != nil {
			log.Printf("Session cannot begin")
			http.Error(w, "Session cannot begin", http.StatusBadRequest)
			return
		}
		clientIP := r.RemoteAddr
		if len(clientIP) == 0 {
			clientIP = r.Header.Get("X-Forwarded-For")
		}

		err = ch.UserStore.LogSignIn(user, time.Now(), clientIP)

		// writing response to the clients
		w.Header().Set("Content-Type", "application/json")
		// status code 201
		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(user); err != nil {
			log.Printf("User profile cannot be encoded in JSON format")
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}
	} else {
		http.Error(w, "Error status method: only accept Post", http.StatusMethodNotAllowed)
	}
}

// SpecificSessionHandler ...
func (ch *ContextHandler) SpecificSessionHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodDelete {
		base := filepath.Base(r.URL.Path)
		if base != "mine" {
			log.Printf("the last path segment does not equal \"mine\"")
			http.Error(w, "Session error", http.StatusForbidden)
			return
		}

		// end session
		sessionID, err := sessions.EndSession(r, ch.SessionID, ch.SessionStore)
		if err != nil {
			log.Printf("session has already been ended %s", sessionID)
			http.Error(w, "Session error", http.StatusForbidden)
			return
		}
		// print out sign out information
		w.Write([]byte("signed out"))
	} else {
		http.Error(w, "Error status method: only accept Post", http.StatusMethodNotAllowed)
	}
}
