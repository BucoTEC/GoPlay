package helpers

import "fmt"

type Human struct {
	Age int
	FirstName string
	LastName string
}

func (h Human) PrintFullName() {
	fmt.Println(h.FirstName, h.LastName)
}
