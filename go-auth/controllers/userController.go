package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/BucoTEC/go-auth/helpers"
	"github.com/BucoTEC/go-auth/models"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2/bson"
)


func GetUsers() gin.HandlerFunc{
	return func(c *gin.Context){}
}

func GetUser() gin.HandlerFunc{
	return func(c *gin.Context){
		userId := c.Param("user_id")

		if err := helpers.MatchUserTypeToUid(c, userId); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
			return
		}
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

		var user models.User
		err := userCollection.FindOne(ctx, bson.M{"user_id":userId}).Decode(&user)
		defer cancel()
		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, user)
	}
}
