package main

import "fmt"

func main() {

	data := make(chan string)

	go func() {
		data <- "Hello World"
	}()

	fmt.Println(<-data)

}
