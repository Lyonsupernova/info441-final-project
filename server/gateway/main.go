package main

import (
	"encoding/json"
	"fmt"
	"info441-final-project/server/gateway/handlers"
	"info441-final-project/server/gateway/models/users"
	"info441-final-project/server/gateway/sessions"
	"log"
	"net/http"
	"net/http/httputil"
	"os"
	"strings"
	"time"

	"github.com/go-redis/redis"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// setting environment variables
	sessionID := os.Getenv("SESSIONKEY")
	redisAddr := os.Getenv("REDISADDR")
	TLSKEY := os.Getenv("TLSKEY")
	TLSCERT := os.Getenv("TLSCERT")
	SUBSCRIPTION := os.Getenv("SUBSCRIPTION")
	PRODUCT := os.Getenv("PRODUCT")
	DSN := os.Getenv("DSN")
	addr := os.Getenv("ADDR")
	if len(addr) == 0 {
		addr = ":443"
	}
	if len(redisAddr) == 0 {
		redisAddr = "127.0.0.1:6379"
	}

	redisDB := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})
	sessionStore := sessions.NewRedisStore(redisDB, time.Hour)
	userStore, err := users.NewMySQLStore(DSN)
	if err != nil {
		log.Printf("Unable to open database mysql %v", err)
	}

	// setting structs
	contextHandler := &handlers.ContextHandler{
		SessionID:    sessionID,
		SessionStore: sessionStore,
		UserStore:    userStore,
	}

	type messageUser struct {
		ID       int64  `json:"id"`
		UserName string `json:"username"`
	}

	// Setting director for subscription microservices
	subscriptionDirector := func(r *http.Request) {
		auth := r.Header.Get("Authorization")
		if len(auth) == 0 {
			auth = r.URL.Query().Get("auth")
		}

		if len(r.Header.Get("X-User")) == 0 {
			r.Header.Add("X-User", "")
		}

		sessID := sessions.SessionID(strings.TrimPrefix(auth, "Bearer "))
		sessState := &handlers.SessionState{}
		err := contextHandler.SessionStore.Get(sessID, sessState)

		if err == nil {
			newUser := &messageUser{sessState.User.UserID, sessState.User.UserName}
			result, err := json.Marshal(newUser)
			log.Println(string(result))
			if err != nil {
				log.Printf("Unable to encode X-User for messaging: %v", err)
				return
			}
			r.Header.Set("X-User", fmt.Sprint(string(result)))
		} else {
			r.Header.Del("X-User")
		}

		r.Host = SUBSCRIPTION
		r.URL.Host = SUBSCRIPTION
		r.URL.Scheme = "http"
	}
	subscriptionProxy := &httputil.ReverseProxy{Director: subscriptionDirector}

	// Call this function to intizalize callProducrt process
	callProduct(PRODUCT)

	// routings
	mux := http.NewServeMux()
	log.Printf("server is listening at %s...", addr)
	mux.HandleFunc("/v1/users", contextHandler.UsersHandler)
	mux.HandleFunc("/v1/users/", contextHandler.SpecificUserHandler)
	mux.HandleFunc("/v1/sessions", contextHandler.SessionsHandler)
	mux.HandleFunc("/v1/sessions/", contextHandler.SpecificSessionHandler)
	mux.Handle("/v1/subscribe", subscriptionProxy)
	mux.Handle("/v1/subscribe/", subscriptionProxy)
	mux.Handle("/v1/product", subscriptionProxy)
	//mux.Handle("/products", productProxy)
	wrappedMux := handlers.NewHeaderHandler(mux)
	log.Fatal(http.ListenAndServeTLS(addr, TLSCERT, TLSKEY, wrappedMux))
}
