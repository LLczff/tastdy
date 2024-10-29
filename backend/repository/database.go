package repository

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/LLczff/tastdy/config"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectDB() *mongo.Database {
	// Connect to MongoDB
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	clientOptions := options.Client().ApplyURI(config.AppConfig.DatabaseURI).SetServerAPIOptions(serverAPI)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	if err := client.Ping(context.Background(), nil); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Database connected")

	// We have only one database to interact with
	// Thus, we use db instance instead of client
	database := os.Getenv("MONGO_INITDB_DATABASE")
	return client.Database(database)
}