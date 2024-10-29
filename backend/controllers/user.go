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

type UserController struct {
	service *services.UserService
}

// Create new instance of user controller
func NewUserController(service *services.UserService) *UserController {
	return &UserController{service: service}
}


func (ctrl *UserController) PostSignUp(c *gin.Context) {
	var body dto.AuthRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": constants.ErrBadParams})
		return
	}

	// Check valid user
	if ctrl.service.CheckUsernameDuplicate(body.Username) {
		c.AbortWithStatusJSON(http.StatusConflict, gin.H{"error": "username has already been used"})
		return
	}

	if err := ctrl.service.CreateUser(body); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": constants.ErrServer})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "register succeed"})
}


func (ctrl *UserController) PostLogin(c *gin.Context) {
	var body dto.AuthRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": constants.ErrBadParams})
		return
	}

	// Find user
	filter := bson.D{{Key: "username", Value: body.Username}}
	user, err := ctrl.service.ReadUser(filter)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Verify password
	if !utils.VerifyPassword(body.Password, user.Password) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	token, err := utils.GenerateToken(user.ID.Hex())
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"token": token})
}

// Get user's own data, authentication needed
func (ctrl *UserController) GetMe(c *gin.Context)  {
	uid, exists := c.Get("uid")
	id, ok := uid.(string)
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

	// Check user exists
	filter := bson.D{{Key: "_id", Value: objId}}
	user, err := ctrl.service.ReadUser(filter)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	result := dto.UserData{
		ID: user.ID,
		Username: user.Username,
		Image: user.Image,
	}

	// response will be formatted by 
	c.JSON(http.StatusOK, result)
}


// Get target user details, no need to authenticate
func (ctrl *UserController) GetUser(c *gin.Context) {
	uid, exists := c.Get("uid")
	id, ok := uid.(string)
	var viewerObjId *primitive.ObjectID
	if exists && ok {
		temp, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
			return
		}
		viewerObjId = &temp
	}

	target := c.Param("id")
	targetObjId, err := primitive.ObjectIDFromHex(target)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": constants.ErrBadParams})
		return
	}

	result, err := ctrl.service.GetUser(targetObjId, viewerObjId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	if result.ID == primitive.NilObjectID {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": constants.ErrNotFound})
		return
	}

	c.JSON(http.StatusOK, result)
}


func (ctrl *UserController) PatchUserImage(c *gin.Context) {
	var body dto.ImageUploadRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": constants.ErrBadParams})
		return
	}

	uid, exists := c.Get("uid")
	id, ok := uid.(string)
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

	// Check user exists
	filter := bson.D{{Key: "_id", Value: objId}}
	_, err = ctrl.service.ReadUser(filter)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	// update image
	err = ctrl.service.UpdateUserImage(objId, body.Image)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "image has been updated"})
}