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

	app.Get("/:id",func(c *fiber.Ctx) error {
		param := c.Params("id")
		return c.SendString("Hello world" + param)
	})

	app.Listen(":3000")
}
