package dto

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Service arguments
type CreateRecipeData struct {
	Author	primitive.ObjectID
	CreateRecipeRequest
}

type UpdateRecipeData struct {
	ID	primitive.ObjectID
	CreateRecipeRequest
}

// Request
type CreateRecipeRequest struct {
	Dish 		string 		`json:"dish" binding:"required"`
	Category 	string 		`json:"category" binding:"required,oneof=main soup dessert salad snack beverage"`
	Image 		string 		`json:"image" binding:"required"`
	Ingredients []string 	`json:"ingredients" binding:"required"`
	Procedures 	[]string 	`json:"procedures" binding:"required"`
}

type SearchRecipeRequest struct {
	SearchTerm	string		`form:"keyword" binding:"-"`
	SortBy		string		`form:"sort" binding:"required,oneof=popular timestamp"`
	Category 	[]string 	`form:"category[]" binding:"omitempty,dive,oneof=main soup dessert salad snack beverage"`
	Page		int			`form:"page" binding:"required,gt=0"`
}


// Response
type ShortRecipe struct {
	ID			primitive.ObjectID	`bson:"_id" json:"_id"`
	Dish 		string 				`bson:"dish" json:"dish"`
	Author 		string 				`bson:"author" json:"author"`
	Favorite 	int 				`bson:"favorite" json:"favorite"`
	Image 		string 				`bson:"image" json:"image"`
}

type Recipe struct {
	Category 	string 				`bson:"category" json:"category"`
	CreatedAt 	primitive.DateTime 	`bson:"createdAt" json:"createdAt"`
	Liked		bool				`bson:"liked" json:"liked"`
	ShortRecipe						`bson:",inline"`
}

type SearchRecipeResponse struct {
	Data		[]Recipe	`bson:"data" json:"data"`
	Total		int			`bson:"total" json:"total"`
} 

type RecipeDetails struct {
	Ingredients []string	`bson:"ingredients" json:"ingredients"`
	Procedures 	[]string	`bson:"procedures" json:"procedures"`
	Recipe					`bson:",inline"`
	// modify the author fields to full details
	Author 		UserData	`bson:"author" json:"author"` 
}