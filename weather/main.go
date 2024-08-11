package main

import (
	"fmt"

	"github.com/google/uuid"
)

func main(){
	name := "Adnan"
	id := uuid.New()
	fmt.Printf("Hello %v, yor id is %v",name, id)
}
