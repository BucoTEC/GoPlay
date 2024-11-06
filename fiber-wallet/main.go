package main

import "github.com/gofiber/fiber/v2"

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Listen(":3000")
}

// TODO crud operations on users (search function by name which needs to be unique)
// TODO crud operations on wallets (many to meany but there needs to be a wallet owner)
// TODO look how to setup transactions on the wallet instance
