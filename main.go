package main

import "fmt"

func main() {
	fmt.Println("Hello World")

	names := []string{"John", "Paul", "George", "Ringo"}

	for i := range names {
		fmt.Println(names[i])
	}

	for i, name := range names {
		fmt.Println(i, name) // Prints both index and value
	}

	type person struct {
		Name string
	}

	adnan := person{Name: "Adnan"}

	fmt.Println(adnan.Name)

	names = append(names, "Adnan")

	printType(names)

	fmt.Println(names[len(names)-1])

}

func printType[T any](input T) {
	format := "%T\n"
	fmt.Printf(format, input)
}
