package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID			primitive.ObjectID		`bson:"_id,omitempty"`
	Username	string					`bson:"username"`
	Password	string					`bson:"password"`
	Image		string					`bson:"image"`
	CreatedAt	time.Time				`bson:"registeredAt"`
	UpdatedAt	time.Time				`bson:"updatedAt,omitempty"`
}

type Recipe struct {
	ID			primitive.ObjectID		`bson:"_id,omitempty"`
	Dish		string					`bson:"dish"`
	Category	string					`bson:"category"`
	Image		string					`bson:"image"`
	Author		primitive.ObjectID		`bson:"author"`
	Ingredients	[]string				`bson:"ingredients"`
	Procedures	[]string				`bson:"procedures"`
	Favorite	[]primitive.ObjectID	`bson:"favorite"`
	CreatedAt	time.Time				`bson:"createdAt"`
	UpdatedAt	time.Time				`bson:"updatedAt,omitempty"`
}