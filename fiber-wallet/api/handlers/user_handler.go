package handlers

import (
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
		return c.SendString("create user")
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

// TODO maybe move to struct
