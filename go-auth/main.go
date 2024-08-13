package main

import (
	"os"

	"github.com/BucoTEC/go-auth/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		port = "8000"
	}

	router := gin.New()
	router.Use(gin.Logger())

	routes.AuthRoutes(router)
	routes.UserRoutes(router)

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello from gin"})
	})

	router.Run(":" + port)
}
