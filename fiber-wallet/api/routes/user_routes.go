package routes

import (
	"github.com/BucoTEC/fiber-wallet/api/handlers"
	"github.com/gofiber/fiber/v2"
)

func UserRouter(app fiber.Router) {
	userRoutes := app.Group("/users")
	userRoutes.Get("/", handlers.SearchUsers())
	userRoutes.Get("/:id", handlers.GetUser())
	userRoutes.Post("/", handlers.CreateUser())
	userRoutes.Put("/:id", handlers.UpdateUser())
	userRoutes.Delete("/:id", handlers.DeleteUser())
}
