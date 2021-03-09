package main

import (
	"log"
	"net/http"
	"time"
)

// Start a periodic call process
func callProduct(PRODUCT string) {
	url := "http://product:80/products"
	for true {
		call(url)
		time.Sleep(time.Hour)
	}
}

// Request /product GET endpoint once
func call(url string) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("Errors generating product request endpoint: %v", err)
	}

	_, err = http.DefaultClient.Do(req)
	if err != nil {
		log.Printf("Errors requesting product endpoint: %v", err)
	}
}
