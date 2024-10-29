package routes

import (
	"github.com/LLczff/tastdy/controllers"
	"github.com/LLczff/tastdy/middlewares"
	"github.com/LLczff/tastdy/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func Setup(router *gin.Engine, db *mongo.Database) {
	// CORs
	corsConfig := cors.DefaultConfig()
  	corsConfig.AllowOrigins = []string{"http://localhost:3000"}
	router.Use(cors.New(corsConfig))

	// Default middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	recipeService := services.NewRecipeService(db)
	userService := services.NewUserService(db)
	recipeController := controllers.NewRecipeController(recipeService)
	userController := controllers.NewUserController(userService)

	// Public route
	router.POST("/sign-up", userController.PostSignUp)
	router.POST("/login", userController.PostLogin)
	router.GET("/recommend", recipeController.GetRecommend)
	
	// Optional authenticate route
	optionalAuth := router.Group("/")
	optionalAuth.Use(middlewares.OptionalAuthenticate())
	optionalAuth.GET("/recipe", recipeController.GetRecipes)
	optionalAuth.GET("/user/:id", userController.GetUser)
	optionalAuth.GET("/recipe/:id", recipeController.GetRecipe)
	
	// Private route
	private := router.Group("/")
	private.Use(middlewares.Authenticate())
	{
		private.GET("/me", userController.GetMe)
		private.PATCH("/user/image", userController.PatchUserImage)
		recipe := private.Group("/recipe")
		{
			recipe.POST("/", recipeController.PostRecipe)
			recipe.PUT("/:id", recipeController.PutRecipe)
			recipe.PATCH("/:id", recipeController.PatchRecipe)
			recipe.DELETE("/:id", recipeController.DeleteRecipe)
		}
	}
}