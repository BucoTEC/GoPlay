package main

import "fmt"

func main() {

	data := make(chan string)

	go func() {
		data <- "Hello World"
	}()

	fmt.Println(<-data)

}

// github actions ci cd
// two step
// build with push do aws ecr
// deploy to aws ecs
// cloud watch monitoring check x-ray
// api gateway
// lambda
// secrets
