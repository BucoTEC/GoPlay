package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func main(){
	godotenv.Load(".env")

	port := os.Getenv("PORT")
	name := "Adnan"
	fmt.Printf("Hello my name is %v, nice to meet you. I am running on port %v \n",name,port)
}
