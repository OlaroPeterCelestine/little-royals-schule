package main

import (
	"log"
	"net/http"
	"os"

	"littleroyals/backend/internal/httpapi"
	"littleroyals/backend/internal/school"
)

func main() {
	register, err := school.Load()
	if err != nil {
		log.Fatal(err)
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Little Royals API on :%s", port)
	if err := http.ListenAndServe(":"+port, httpapi.New(register).Handler()); err != nil {
		log.Fatal(err)
	}
}
