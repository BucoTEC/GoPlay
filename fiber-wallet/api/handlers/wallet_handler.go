package handlers

import "github.com/gofiber/fiber/v2"

func SearchWallets() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("search wallet")
	}
}

func GetWallet() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("get wallet by id")
	}
}

func CreateWallet() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("create wallet")
	}
}

func UpdateWallet() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("update wallet")
	}
}

func DeleteWallet() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("delete wallet")
	}
}
