package routes

import (
	"github.com/BucoTEC/fiber-wallet/api/handlers"
	"github.com/BucoTEC/fiber-wallet/pkg/user"
	"github.com/gofiber/fiber/v2"
)

func UserRouter(app fiber.Router, service user.Service) {
	userRoutes := app.Group("/users")
	userRoutes.Get("/", handlers.SearchUsers(service))

	// Example endpoint
	// @Summary Get a user by ID
	// @Description Get user details by ID
	// @Tags user
	// @Accept json
	// @Produce json
	// @Param id path int true "User ID"
	// @Success 200 {object} User
	// @Failure 400 {object} ErrorResponse
	// @Failure 404 {object} ErrorResponse
	// @Router /users/{id} [get]
	userRoutes.Get("/:id", handlers.GetUserById(service))
	userRoutes.Post("/", handlers.CreateUser(service))
	userRoutes.Put("/:id", handlers.UpdateUser(service))
	userRoutes.Delete("/:id", handlers.DeleteUser(service))
}
