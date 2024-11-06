package main

import (
	"github.com/BucoTEC/fiber-wallet/api/routes"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()
	v1 := configureV1(app)

	v1.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("hello from the api")
	})

	routes.UserRouter(v1)
	app.Listen(":3000")
}

// TODO crud operations on users (search function by name which needs to be unique)
// TODO crud operations on wallets (many to meany but there needs to be a wallet owner)
// TODO look how to setup transactions on the wallet instance

func configureV1(app fiber.Router) fiber.Router {
	api := app.Group("/api")
	v1 := api.Group("/v1")
	return v1
}
