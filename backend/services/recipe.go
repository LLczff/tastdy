package services

import (
	"context"
	"time"

	"github.com/LLczff/tastdy/constants"
	"github.com/LLczff/tastdy/dto"
	"github.com/LLczff/tastdy/models"
	"github.com/LLczff/tastdy/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type RecipeService struct {
	db *mongo.Database
}

// Create new instance of recipe service
func NewRecipeService(db *mongo.Database) *RecipeService {
	return &RecipeService{db: db}
}

// Get recipe by specific filter using FindOne() MongoDB command. 
func (s *RecipeService) ReadRecipe(filter interface{}) (models.Recipe, error) {
	ctx, cancel := context.WithTimeout(context.Background(), constants.DatabaseInteractTimeout)
    defer cancel()

	collection := s.db.Collection("recipes")
	
	var result models.Recipe
	err := collection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		return models.Recipe{}, err
	}

	return result, nil
}


func (s *RecipeService) GetRecommend() ([]dto.ShortRecipe, error) {
	ctx, cancel := context.WithTimeout(context.Background(), constants.DatabaseInteractTimeout)
    defer cancel()
    
    collection := s.db.Collection("recipes")

	lookupStage := bson.D{
		{Key: "$lookup", 
		 Value: bson.M{
			"from": "user",
			"localField": "author",
			"foreignField": "_id",
			"as": "author",
		}},
	}
	unwindStage := bson.D{{Key: "$unwind", Value: "$author"}}
    fieldStage := bson.D{
      {
        Key: "$project", Value: bson.D{
          {Key: "_id", Value: 1},
          {Key: "dish", Value: 1},
          {Key: "image", Value: 1},
          {Key: "author", Value: "$author.username"},
          {Key: "favorite", Value: bson.D{{Key: "$size", Value: "$favorite"}}},
        },
    }}
    sortStage := bson.D{{Key: "$sort", Value: bson.D{{Key: "favorite", Value: -1}}}}
    limitStage := bson.D{{Key: "$limit", Value: 6}}

    cursor, err := collection.Aggregate(ctx, mongo.Pipeline{lookupStage, unwindStage, fieldStage, sortStage, limitStage})
    
    if err != nil {
	  return nil, err
    }
    defer cursor.Close(ctx)
    
    var result []dto.ShortRecipe
    if err := cursor.All(ctx, &result); err != nil {
	  return nil, err
    }

    return result, nil
}


func (s *RecipeService) GetRecipes(data dto.SearchRecipeRequest,id *primitive.ObjectID) (dto.SearchRecipeResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), constants.DatabaseInteractTimeout)
    defer cancel()

	collection := s.db.Collection("recipes")

	// Pipeline order is category -> search -> lookup -> fields(author's name, liked, etc.) -> sort
	// Thus, we will append search and category at very first pipeline index in LIFO format
	pipeline := mongo.Pipeline{}
	// Match stage
	if data.SearchTerm != "" {
		// add as the first stage
		matchStage := bson.D{{Key: "$match", 
			Value: bson.D{{
				Key: "dish", 
				Value: primitive.Regex{Pattern: ".*" + data.SearchTerm + ".*", Options: "i"}}},
		}}
		pipeline = append(mongo.Pipeline{matchStage}, pipeline...)
	}
	// Category
	if len(data.Category) > 0 {
		// add as the first stage
		// if match stage has been added before, it will goes to the second stage
		categoryStage := bson.D{{Key: "$match",
			Value: bson.D{{
				Key: "category",
				Value: bson.M{"$in": data.Category},
			}},
		}}
		pipeline = append(mongo.Pipeline{categoryStage}, pipeline...)
	}
	
	// Lookup stage
	lookupStage := bson.D{
		{Key: "$lookup", 
		 Value: bson.M{
			"from": "user",
			"localField": "author",
			"foreignField": "_id",
			"as": "author",
		}},
	}
	unwindStage := bson.D{{Key: "$unwind", Value: "$author"}}

	// Liked stage
	liked := utils.GetLikedField(id)
	likedStage :=  bson.D{{Key: "$addFields", Value: bson.D{{Key: "liked", Value: liked}}}}
	// Fields stage
	fieldStage := bson.D{
		{
		  Key: "$project", Value: bson.D{
			{Key: "_id", Value: 1},
			{Key: "dish", Value: 1},
			{Key: "category", Value: 1},
			{Key: "author", Value: "$author.username"},
			{Key: "image", Value: 1},
			{Key: "favorite", Value: bson.D{{Key: "$size", Value: "$favorite"}}},
			{Key: "liked", Value: 1},
			{Key: "createdAt", Value: 1},
		  },
	}}
	// Sort stage
	var sortBy string
	switch data.SortBy {
	case "popular":
		sortBy = "favorite"
	case "timestamp":
		sortBy = "createdAt"
	}
	sortStage := bson.D{{Key: "$sort", Value: bson.D{{Key: sortBy, Value: -1}}}}

	// Data query
	pipeline = append(pipeline, lookupStage, unwindStage, likedStage, fieldStage, sortStage)

	// Using facet to count, skip and limit data
	facetStage := bson.D{{Key: "$facet", Value: bson.D{
		{Key: "metadata", Value: bson.A{bson.D{{Key: "$count", Value: "total"}}}},
		{Key: "data", Value: bson.A{
			bson.D{{Key: "$skip", Value: constants.ItemPerExplorePage * (data.Page - 1)}},
			bson.D{{Key: "$limit", Value: constants.ItemPerExplorePage}},
		}},
	}}}
	// After facet, unnest metadata and projection output
	unnestStage := bson.D{{Key: "$unwind", Value: "$metadata"}}
	projectionStage := bson.D{{Key: "$project", Value: bson.D{
		{Key: "total", Value: "$metadata.total"},
		{Key: "data", Value: "$data"},
	}}}
	pipeline = append(pipeline, facetStage, unnestStage, projectionStage)

	cursor, err := collection.Aggregate(ctx, pipeline)

	if err != nil {
		return dto.SearchRecipeResponse{}, err
	}
	defer cursor.Close(ctx)

	if !cursor.Next(ctx) {
		return dto.SearchRecipeResponse{}, err
    }
	
	var result dto.SearchRecipeResponse
    if err := cursor.Decode(&result); err != nil {
	  return dto.SearchRecipeResponse{}, err
    }

	return result, nil
}


func (s *RecipeService) GetRecipe(rid primitive.ObjectID, uid *primitive.ObjectID) (dto.RecipeDetails, error) {
	ctx, cancel := context.WithTimeout(context.Background(), constants.DatabaseInteractTimeout)
    defer cancel()

	collection := s.db.Collection("recipes")	

	matchStage := bson.D{{Key: "$match", Value: bson.D{{Key: "_id", Value: rid}}}}
	lookupStage := bson.D{
		{Key: "$lookup", 
		 Value: bson.M{
			"from": "user",
			"localField": "author",
			"foreignField": "_id",
			"as": "author",
		}},
	}
	unwindStage := bson.D{{Key: "$unwind", Value: "$author"}}
	fieldStage := bson.D{
		{
		  Key: "$project", Value: bson.D{
			{Key: "_id", Value: 1},
			{Key: "category", Value: 1},
			{Key: "dish", Value: 1},
			{Key: "author", Value: "$author"},
			{Key: "image", Value: 1},
			{Key: "ingredients", Value: 1},
			{Key: "procedures", Value: 1},
			{Key: "favorite", Value: bson.D{{Key: "$size", Value: "$favorite"}}},
			{Key: "liked", Value: utils.GetLikedField(uid)},
			{Key: "createdAt", Value: 1},
		  },
	}}

	cursor, err := collection.Aggregate(ctx, mongo.Pipeline{matchStage, lookupStage, unwindStage, fieldStage})

	if err != nil {
		return dto.RecipeDetails{}, err
	}
	defer cursor.Close(ctx)
	
    if !cursor.Next(ctx) {
		return dto.RecipeDetails{}, err
    }
	
	var result dto.RecipeDetails
    if err := cursor.Decode(&result); err != nil {
	  return dto.RecipeDetails{}, err
    }

	return result, nil
}


func (s *RecipeService) CreateRecipe(data dto.CreateRecipeData) error {
	ctx, cancel := context.WithTimeout(context.Background(), constants.DatabaseInteractTimeout)
    defer cancel()

	collection := s.db.Collection("recipes")
	doc := models.Recipe{
		Dish: data.Dish,
		Category: data.Category,
		Image: data.Image,
		Author: data.Author,
		Ingredients: data.Ingredients,
		Procedures: data.Procedures,
		Favorite: []primitive.ObjectID{},
		CreatedAt: time.Now(),
	}
	_, err := collection.InsertOne(ctx, doc)
	if err != nil {
		return err
	}

	return nil
}


func (s *RecipeService) UpdateRecipe(data dto.UpdateRecipeData) error {
	ctx, cancel := context.WithTimeout(context.Background(), constants.DatabaseInteractTimeout)
    defer cancel()

	collection := s.db.Collection("recipes")

	update := bson.D{{Key: "$set", Value: bson.D{
		{Key: "dish", Value: data.Dish},
		{Key: "category", Value: data.Category},
		{Key: "image", Value: data.Image},
		{Key: "ingredients", Value: data.Ingredients},
		{Key: "procedures", Value: data.Procedures},
		{Key: "updatedAt", Value: time.Now()},
	}}}
	_, err := collection.UpdateByID(ctx, data.ID, update)
	if err != nil {
		return err
	}

	return nil
}


func (s *RecipeService) LikeRecipe(uid, rid primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), constants.DatabaseInteractTimeout)
    defer cancel()

	collection := s.db.Collection("recipes")

	// check favorite status
	var recipe models.Recipe
	filter := bson.D{{Key: "_id", Value: rid}}
	recipe, err := s.ReadRecipe(filter)
	if err != nil {
		return err
	}
	
	action := "$push"
	for _, user := range recipe.Favorite {
		if user == uid {
			action = "$pull"
			break
		}
	}

	update := bson.D{{Key: action, Value: bson.D{
		{Key: "favorite", Value: uid},
	}}}
	_, err = collection.UpdateByID(ctx, rid, update)
	if err != nil {
		return err
	}

	// Get liked
	_, err = s.GetRecipe(rid, &uid)
	if err != nil {
		return err
	}

	return nil
}


func (s *RecipeService) DeleteRecipe(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), constants.DatabaseInteractTimeout)
    defer cancel()

	collection := s.db.Collection("recipes")
	filter := bson.D{{Key: "_id", Value: id}}
	
	_, err := collection.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}

	return nil
}