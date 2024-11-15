package handlers

import (
	"github.com/BucoTEC/fiber-wallet/pkg/infrastructure/models"
	"github.com/BucoTEC/fiber-wallet/pkg/user"
	"github.com/gofiber/fiber/v2"
)

func SearchUsers(service user.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {

		// Extract email from query string
		email := c.Query("email")
		if email == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "email query parameter is required",
			})
		}

		// Create conditions map
		conditions := map[string]interface{}{
			"email": email,
			// Include additional conditions if needed, like soft-delete
			"deleted_at": nil,
		}

		// Call the service to search for users
		users, err := service.SearchUsers(conditions)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		// Return users as JSON
		return c.Status(fiber.StatusOK).JSON(users)
	}
}

func GetUser(service user.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("get user by id")
	}
}

func CreateUser(service user.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var user models.User

		// Parse JSON body into user model
		if err := c.BodyParser(&user); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request payload"})
		}

		// Call the CreateUser method on the service
		if err := service.CreateUser(user); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "could not create user", "message": err.Error()})
		}

		// Respond with success message
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "user created successfully", "user": user})
	}
}

func UpdateUser(service user.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("update user")
	}
}

func DeleteUser(service user.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("delete user")
	}
}
