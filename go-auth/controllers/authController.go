package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/BucoTEC/go-auth/database"
	"github.com/BucoTEC/go-auth/models"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/mongo"
	"gopkg.in/mgo.v2/bson"
)

var userCollection *mongo.Collection = database.OpenCollection(database.Client, "user")
var validate = validator.New()

func Signup() gin.HandlerFunc{
	return func(c *gin.Context) {
		var user models.User
		
		if err:=c.BindJSON(&user); err != nil{
			c.JSON(http.StatusBadRequest,gin.H{"error":err.Error()})
		}
		
		if validationErr :=  validate.Struct(user); validationErr !=nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": validationErr.Error()})
			return
		}
		
		var ctx,cancel=context.WithTimeout(context.Background(),100*time.Second)
		err := userCollection.FindOne(ctx, bson.M{"user_id":1}).Decode(&user)
		defer cancel()

		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
}

func Login() gin.HandlerFunc{
	return func(ctx *gin.Context) {}
}

