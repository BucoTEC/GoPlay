package handlers

import "github.com/gofiber/fiber/v2"

func SearchUsers() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("search users")
	}
}

func GetUser() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("get user by id")
	}
}

func CreateUser() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("create user")
	}
}

func UpdateUser() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("update user")
	}
}

func DeleteUser() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("delete user")
	}
}
