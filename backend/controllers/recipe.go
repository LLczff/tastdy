package controllers

import (
	"net/http"

	"github.com/LLczff/tastdy/constants"
	"github.com/LLczff/tastdy/dto"
	"github.com/LLczff/tastdy/services"
	"github.com/LLczff/tastdy/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RecipeController struct {
	service *services.RecipeService
}

// Create new instance of recipe controller
func NewRecipeController(service *services.RecipeService) *RecipeController {
	return &RecipeController{service: service}
}


func (ctrl *RecipeController) GetRecommend(c *gin.Context) {
	result, err := ctrl.service.GetRecommend()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	  	return
	}

    c.JSON(http.StatusOK, result)
}


func (ctrl *RecipeController) GetRecipes(c *gin.Context) {
	var params dto.SearchRecipeRequest
	if err := c.ShouldBindQuery(&params); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": constants.ErrBadParams})
		return
	}

	sub, exists := c.Get("sub")
	id, ok := sub.(string)
	var objId *primitive.ObjectID
	if exists && ok {
		temp, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
			return
		}
		objId = &temp
	}

	result, err := ctrl.service.GetRecipes(params, objId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	  	return
	}

    c.JSON(http.StatusOK, result)
}


func (ctrl *RecipeController) GetRecipe(c *gin.Context) {
	id := c.Param("id")
	recipeObjId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	sub, exists := c.Get("sub")
	id, ok := sub.(string)
	var userObjId *primitive.ObjectID
	if exists && ok {
		temp, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
			return
		}
		userObjId = &temp
	}

	result, err := ctrl.service.GetRecipe(recipeObjId, userObjId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (ctrl *RecipeController) PostRecipe(c *gin.Context) {
	var body dto.CreateRecipeRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": constants.ErrBadParams})
		return
	}

	sub, exists := c.Get("sub")
	id, ok := sub.(string)
	if !exists || !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	// format object id
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	// validate ingredients and procedures
	body.Ingredients = utils.RemoveEmptyStrings(body.Ingredients)
	body.Procedures = utils.RemoveEmptyStrings(body.Procedures)
	if len(body.Ingredients) == 0 || len(body.Procedures) == 0 {
		c.AbortWithStatusJSON(http.StatusBadRequest, constants.ErrBadParams)
		return
	}

	// generate recipe data
	data := dto.CreateRecipeData{
		Author: objId,
		CreateRecipeRequest: dto.CreateRecipeRequest{
			Dish: body.Dish,
			Category: body.Category,
			Image: body.Image,
			Ingredients: body.Ingredients,
			Procedures: body.Procedures,
		},
	}
	err = ctrl.service.CreateRecipe(data)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "recipe has been created"})
}


func (ctrl *RecipeController) PutRecipe(c *gin.Context) {
	var body dto.CreateRecipeRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": constants.ErrBadParams})
		return
	}

	sub, exists := c.Get("sub")
	id, ok := sub.(string)
	if !exists || !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	// format user object id
	userObjectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}
	
	// format recipe object id
	rid := c.Param("id")
	recipeObjId, err := primitive.ObjectIDFromHex(rid)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": constants.ErrBadParams})
		return
	}

	// Check exists
	filter := bson.D{{Key: "_id", Value: recipeObjId},{Key: "author", Value: userObjectId}}
	_, err = ctrl.service.ReadRecipe(filter)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": constants.ErrNotFound})
		return
	}

	// validate ingredients and procedures
	body.Ingredients = utils.RemoveEmptyStrings(body.Ingredients)
	body.Procedures = utils.RemoveEmptyStrings(body.Procedures)
	if len(body.Ingredients) == 0 || len(body.Procedures) == 0 {
		c.AbortWithStatusJSON(http.StatusBadRequest, constants.ErrBadParams)
		return
	}

	// generate recipe data
	data := dto.UpdateRecipeData{
		ID: recipeObjId,
		CreateRecipeRequest: dto.CreateRecipeRequest{
			Dish: body.Dish,
			Category: body.Category,
			Image: body.Image,
			Ingredients: body.Ingredients,
			Procedures: body.Procedures,
		},
	}
	err = ctrl.service.UpdateRecipe(data)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "recipe has been updated"})
}


func (ctrl *RecipeController) PatchRecipe(c *gin.Context) {
	sub, exists := c.Get("sub")
	id, ok := sub.(string)
	if !exists || !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	// format user object id
	userObjectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	// format recipe object id
	rid := c.Param("id")
	recipeObjId, err := primitive.ObjectIDFromHex(rid)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": constants.ErrBadParams})
		return
	}

	// Check exists
	filter := bson.D{{Key: "_id", Value: recipeObjId}}
	_, err = ctrl.service.ReadRecipe(filter)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": constants.ErrNotFound})
		return
	}

	err = ctrl.service.LikeRecipe(userObjectId, recipeObjId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "like status updated"})
}


func (ctrl *RecipeController) DeleteRecipe(c *gin.Context) {
	sub, exists := c.Get("sub")
	id, ok := sub.(string)
	if !exists || !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	// format user object id
	userObjectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}
	
	// format recipe object id
	rid := c.Param("id")
	recipeObjId, err := primitive.ObjectIDFromHex(rid)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": constants.ErrBadParams})
		return
	}

	// Check exists
	filter := bson.D{{Key: "_id", Value: recipeObjId},{Key: "author", Value: userObjectId}}
	_, err = ctrl.service.ReadRecipe(filter)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": constants.ErrNotFound})
		return
	}

	err = ctrl.service.DeleteRecipe(recipeObjId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "recipe has been deleted"})
}