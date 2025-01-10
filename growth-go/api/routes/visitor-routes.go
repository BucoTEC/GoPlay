package routes

import "github.com/gofiber/fiber/v2"

func VisitorRoutes(app fiber.Router) {
	visitorRoutes := app.Group("/visitors")
	// search visitor fingertip
	visitorRoutes.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("hello from visitor")
	})
	// get visitor by id
	// create visitor
	// signup visitor
}
