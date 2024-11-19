package routes

import (
	"github.com/BucoTEC/fiber-wallet/api/handlers"
	"github.com/BucoTEC/fiber-wallet/pkg/user"
	"github.com/gofiber/fiber/v2"
)

func UserRouter(app fiber.Router, service user.Service) {
	userRoutes := app.Group("/users")
	userRoutes.Get("/", handlers.SearchUsers(service))
	userRoutes.Get("/:id", handlers.GetUserById(service))
	userRoutes.Post("/", handlers.CreateUser(service))
	userRoutes.Put("/:id", handlers.UpdateUser(service))
	userRoutes.Delete("/:id", handlers.DeleteUser(service))
}
