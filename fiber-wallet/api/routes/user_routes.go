package routes

import "github.com/gofiber/fiber/v2"

func UserRouter(app fiber.Router) {
	userRoutes := app.Group("/users")
	userRoutes.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Get all users")
	})
}
