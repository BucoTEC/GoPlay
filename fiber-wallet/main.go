package main

import (
	"github.com/BucoTEC/fiber-wallet/api/routes"
	"github.com/BucoTEC/fiber-wallet/pkg/infrastructure"
	"github.com/BucoTEC/fiber-wallet/pkg/user"
	"github.com/BucoTEC/fiber-wallet/pkg/wallet"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()
	v1 := configureV1(app)

	v1.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("hello from the api")
	})

	infrastructure.ConnectDb()
	userRepo := user.NewRepo(infrastructure.DB.Db)
	userService := user.NewService(userRepo)

	walletRepo := wallet.NewRepo(infrastructure.DB.Db)
	walletService := wallet.NewService(walletRepo)
	// setup routes
	routes.UserRouter(v1, userService)
	routes.WalletRoutes(v1, walletService)

	app.Listen(":3000")
}

func configureV1(app fiber.Router) fiber.Router {
	api := app.Group("/api")
	v1 := api.Group("/v1")
	return v1
}
