package dto

import "go.mongodb.org/mongo-driver/bson/primitive"

// Request
type AuthRequest struct {
	Username	string `json:"username" binding:"required"`
	Password	string `json:"password" binding:"required"`
}

type ImageUploadRequest struct {
	Image 		string 	`json:"image" binding:"required"`
}

// Response
type UserData struct {
	ID 			primitive.ObjectID	`bson:"_id" json:"_id"`
	Username	string				`bson:"username" json:"username"`
	Image 		string 				`bson:"image" json:"image"`
}

type UserFullDetails struct {
	Posts	[]Recipe	`bson:"posts" json:"posts"`
	UserData			`bson:",inline"`
}
