package users

import "github.com/gofiber/fiber/v2"

func ConfigureRoutes(app *fiber.App) {
	groupe := app.Group("/users")
	groupe.Get("/", getUsers)
}

func getUsers(c *fiber.Ctx) error {
	return nil
}
