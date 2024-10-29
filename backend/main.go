package main

import (
	"context"

	"github.com/LLczff/tastdy/config"
	"github.com/LLczff/tastdy/repository"
	"github.com/LLczff/tastdy/routes"
	"github.com/gin-gonic/gin"
)

func main() {
  r := gin.New()
  config.Load()
  
  // Database connection
	db := repository.ConnectDB()
	defer func() {
		if err := db.Client().Disconnect(context.TODO()); err != nil {
			panic(err)
		  }
	}()

  routes.Setup(r, db)

  r.Run(config.AppConfig.Port)
}