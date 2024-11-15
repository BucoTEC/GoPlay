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

func GetUserById(service user.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Extract the user ID from the path parameter
		id := c.Params("id")
		if id == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "id path parameter is required",
			})
		}

		// Call the service to get the user by ID
		user := service.GetUserById(id)

		// If no user is found, return a 404 Not Found
		if user.ID == 0 {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "user not found",
			})
		}

		// Return the user as JSON
		return c.Status(fiber.StatusOK).JSON(user)
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
