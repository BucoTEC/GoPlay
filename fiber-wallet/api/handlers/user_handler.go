package handlers

import (
	"github.com/BucoTEC/fiber-wallet/pkg/infrastructure/models"
	"github.com/BucoTEC/fiber-wallet/pkg/user"
	"github.com/gofiber/fiber/v2"
)

func SearchUsers(service user.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("search users")
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
