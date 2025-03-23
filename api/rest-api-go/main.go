package main

import (
	"fmt"
	"log"

	_ "rest-api-go/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
)

// @title Fiber Example API
// @version 1.0
// @description This is a sample swagger for Fiber
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.email fiber@swagger.io
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:3001/api/v1
// @BasePath /
func main() {
	// Initialize a new Fiber app
	app := fiber.New()

	app.Get("/swagger/*", swagger.HandlerDefault) // default

	// Define a route for the GET method on the root path '/'
	app.Get("/", func(c *fiber.Ctx) error {
		// Send a string response to the client
		return c.SendString("Hello, World 👋!")
	})

	// get by id
	app.Get("/:id", func(c *fiber.Ctx) error {

		id := c.Params("id")
		// Send a string response to the client
		res := fmt.Sprintf("Hello, World 👋! %s", id)
		return c.Status(fiber.StatusOK).SendString(res)
	})

	// update
	app.Put("/:id", func(c *fiber.Ctx) error {
		// Send a string response to the client
		id := c.Params("id")
		// Send a string response to the client
		res := fmt.Sprintf("Hello, World 👋! %s", id)
		return c.SendString(res)
	})

	// delete
	app.Delete("/", func(c *fiber.Ctx) error {
		id := c.Params("id")
		// Send a string response to the client
		res := fmt.Sprintf("Hello, World 👋! %s", id)
		return c.Status(fiber.StatusOK).SendString(res)
	})

	// search
	app.Get("/", func(c *fiber.Ctx) error {
		// get query params
		// Send a string response to the client
		return c.SendString("Hello, World 👋!")
	})

	// Start the server on port 3000
	log.Fatal(app.Listen(":3000"))
}
