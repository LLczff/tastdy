package middlewares

import (
	"net/http"
	"strings"

	"github.com/LLczff/tastdy/utils"
	"github.com/gin-gonic/gin"
)

func Authenticate() gin.HandlerFunc {
	return func(c *gin.Context) {
		authorization := c.Request.Header.Get("Authorization")

		token := strings.TrimPrefix(authorization, "Bearer ")

		id, err := utils.ValidateToken(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		c.Set("sub", *id)
		c.Next()
	}
}


func OptionalAuthenticate() gin.HandlerFunc {
	return func(c *gin.Context) {
		authorization := c.Request.Header.Get("Authorization")

		token := strings.TrimPrefix(authorization, "Bearer ")

		id, err := utils.ValidateToken(token)
		if err == nil && id != nil {
			// Set ID only if authenticated
			c.Set("sub", *id)
		}

		c.Next()
	}
}