package main

import "fmt"

func main() {
	fmt.Println("Hello World")

	names := []string{"John", "Paul", "George", "Ringo"}

	for i := 0; i < len(names); i++ {
		fmt.Println(names[i])
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
