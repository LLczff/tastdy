package utils

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Remove empty string from string slices
func RemoveEmptyStrings(slice []string) []string {
	// Create a new slice to store non-empty strings
	var result []string
	for _, str := range slice {
		if str != "" {
			result = append(result, str)
		}
	}
	return result
}


// Generated liked pipeline for using in Mongo aggragation
func GetLikedField(id *primitive.ObjectID) bson.D {
	// Return user's favorite status only if user is authenticated
	// otherwise return false
	if id == nil {
		return bson.D{{Key: "$literal", Value: false}}
	}

	return bson.D{
		{Key: "$cond", Value: bson.A{
			bson.D{{Key: "$in", Value: bson.A{id, "$favorite"}}},
			true,
			false,
		}},
	}
}