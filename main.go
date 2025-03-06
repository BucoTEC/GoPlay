package main

import (
	"log"

	"github.com/BucoTEC/GoPlay/users"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	users.ConfigureRoutes(app)

	log.Fatal(app.Listen(":3000"))
}

// TODO add deployment pipeline to be multistage
