package services

import (
	"context"
	"errors"
	"time"

	"github.com/LLczff/tastdy/constants"
	"github.com/LLczff/tastdy/dto"
	"github.com/LLczff/tastdy/models"
	"github.com/LLczff/tastdy/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type UserService struct {
	db *mongo.Database
}

// Create new instance of user service
func NewUserService(db *mongo.Database) *UserService {
	return &UserService{db: db}
}

func (s *UserService) ReadUser(filter interface{}) (models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), constants.DatabaseInteractTimeout)
    defer cancel()

	collection := s.db.Collection("user")
	opts := options.FindOne().SetProjection(bson.D{
		{Key: "_id", Value: 1},
		{Key: "username", Value: 1},
		{Key: "password", Value: 1},
		{Key: "image", Value: 1},
	})

	var user models.User
	err := collection.FindOne(ctx, filter, opts).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return models.User{}, errors.New(constants.ErrUnauthorized)
		}
		return models.User{}, err
	}

	return user, nil
}


func (s *UserService) GetUser(target primitive.ObjectID, viewer *primitive.ObjectID) (dto.UserFullDetails, error) {
	ctx, cancel := context.WithTimeout(context.Background(), constants.DatabaseInteractTimeout)
    defer cancel()

	collection := s.db.Collection("user")

	matchStage := bson.D{{Key: "$match", Value: bson.D{{Key: "_id", Value: target}}}}
	liked := utils.GetLikedField(viewer)
	postPipeline := bson.D{
		{
		  Key: "$project", Value: bson.D{
			{Key: "_id", Value: 1},
			{Key: "category", Value: 1},
			{Key: "dish", Value: 1},
			{Key: "author", Value: "$$authorName"},
			{Key: "image", Value: 1},
			{Key: "ingredients", Value: 1},
			{Key: "procedures", Value: 1},
			{Key: "favorite", Value: bson.D{{Key: "$size", Value: "$favorite"}}},
			{Key: "liked", Value: liked},
			{Key: "createdAt", Value: 1},
		  },
	}}
	lookupStage := bson.D{
		{Key: "$lookup", 
		 Value: bson.M{
			"from": "recipes",
			"localField": "_id",
			"foreignField": "author",
			"let": bson.D{{Key: "authorName", Value: "$username"}},
			"pipeline": mongo.Pipeline{postPipeline},
			"as": "posts",
		}},
	}
	fieldStage := bson.D{
		{Key: "$project", Value: bson.D{
			{Key: "_id", Value: 1},
			{Key: "username", Value: 1},
			{Key: "image", Value: 1},
			{Key: "posts", Value: 1},
		},
	}}

	cursor, err := collection.Aggregate(ctx, mongo.Pipeline{matchStage, lookupStage, fieldStage})

	if err != nil {
		return dto.UserFullDetails{}, err
	}
	defer cursor.Close(ctx)
	
    if !cursor.Next(ctx) {
		return dto.UserFullDetails{}, err
    }
	
	var result dto.UserFullDetails
    if err := cursor.Decode(&result); err != nil {
	  return dto.UserFullDetails{}, err
    }

	return result, nil
}


func (s *UserService) CheckUsernameDuplicate(username string) bool {
	ctx, cancel := context.WithTimeout(context.Background(), constants.DatabaseInteractTimeout)
    defer cancel()

	collection := s.db.Collection("user")
	filter := bson.D{{Key: "username", Value: username}}

	var user models.User
	err := collection.FindOne(ctx, filter).Decode(&user)

	return err == nil
}


func (s *UserService) CreateUser(form dto.AuthRequest) error {
	ctx, cancel := context.WithTimeout(context.Background(), constants.DatabaseInteractTimeout)
    defer cancel()

	// Hash password
	hashed, err := utils.HashPassword(form.Password)
	if err != nil {
		return err
	}

	// Insert data
	collection := s.db.Collection("user")
	doc := models.User{
		Username: form.Username,
		Password: hashed,
		CreatedAt: time.Now(),
	}

	_, err = collection.InsertOne(ctx, doc)
	if err != nil {
		return err
	}

	return nil
}


func (s *UserService) UpdateUserImage(id primitive.ObjectID, image string) error {
	ctx, cancel := context.WithTimeout(context.Background(), constants.DatabaseInteractTimeout)
    defer cancel()

	collection := s.db.Collection("user")

	update := bson.D{{Key: "$set", Value: bson.D{
		{Key: "image", Value: image},
		{Key: "updatedAt", Value: time.Now()},
	}}}
	_, err := collection.UpdateByID(ctx, id, update)
	if err != nil {
		return err
	}

	return nil
}