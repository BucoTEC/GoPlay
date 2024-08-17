package main

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func main(){
	fmt.Println("hello from fiber")
	app := fiber.New();

	app.Get("/",func(c *fiber.Ctx) error {
		return c.SendString("Hello world")
	})

	app.Listen(":3000")
}
