package main

import (
	"fmt"
	"hello/buco/helpers"
)


func main(){
	
	name := "Adnan"
	x,y := 3,2

	if value := helpers.Check(x,y); value > 0 {

		fmt.Printf("Hello my old friend %v \n", name)
	}

	fmt.Printf("No my old friend %v \n", name)

	oldFriend := helpers.Human{
		Age: 12,
		FirstName: "Safet",
		LastName: "Zajko",
	} 

	changeName(&oldFriend.FirstName)
	fmt.Println(oldFriend.FirstName)
	oldFriend.PrintFullName()
}

func changeName(name *string){
	*name = "Hello new name"
	fmt.Println("Hello my friend")
}
