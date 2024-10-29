package config

import (
	"fmt"
	"log"
	"os"
)

type Config struct {
	Port 		string
	DatabaseURI string
}

var AppConfig Config

func Load() {
	databaseURI, err := getDatabaseURI()
	if err != nil {
		log.Fatal(err)
	}

	AppConfig = Config{
		Port: ":8080",
		DatabaseURI: databaseURI,
	}
}

func getDatabaseURI() (string, error) {
	host := os.Getenv("MONGO_INITDB_HOST")
	db := os.Getenv("MONGO_INITDB_DATABASE")
	user := os.Getenv("MONGO_INITDB_USERNAME")
	pwd := os.Getenv("MONGO_INITDB_PASSWORD")

	uri := fmt.Sprintf("mongodb://%s:%s@%s/?authSource=%s", user, pwd, host, db)
	return uri, nil
}