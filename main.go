package main

import "fmt"


func main(){
	
	name := "Adnan"
	x,y := 3,2

	if value := check(x,y); value > 0 {

		fmt.Printf("Hello my old friend %v \n", name)
	}

	fmt.Printf("No my old friend %v \n", name)
}

func check(x int, y int) int {
	return x - y 
}
