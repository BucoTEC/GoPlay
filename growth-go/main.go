package main

import (
	"growth-go/api/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/swagger"
)

// @title			Order Api
// @version		1.0
// @description	This is an Order Api just for young people
// @termsOfService	http://swagger.io/terms/
func main() {
	app := fiber.New()
	app.Use(cors.New())
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Live check")
	})

	api := app.Group("/api")
	v1 := api.Group("/v1")
	v1.Get("/swagger/*", swagger.HandlerDefault)

	// setup of routes
	routes.VisitorRoutes(v1)

	app.Listen(":3000")
}

// update to the main
