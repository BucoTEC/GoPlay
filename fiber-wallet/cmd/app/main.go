package main

import (
	"github.com/BucoTEC/fiber-wallet/api/routes"
	"github.com/BucoTEC/fiber-wallet/pkg/infrastructure"
	"github.com/BucoTEC/fiber-wallet/pkg/user"
	"github.com/BucoTEC/fiber-wallet/pkg/wallet"
	"github.com/gofiber/fiber/v2"

	swagger "github.com/arsmn/fiber-swagger/v2"

	_ "github.com/BucoTEC/fiber-wallet/docs"
)

func main() {
	app := fiber.New()
	v1 := configureV1(app)

	v1.Get("/swagger/*", swagger.HandlerDefault)

	infrastructure.ConnectDb()

	walletRepo := wallet.NewRepo(infrastructure.DB.Db)
	walletService := wallet.NewService(walletRepo)

	userRepo := user.NewRepo(infrastructure.DB.Db)
	userService := user.NewService(userRepo)

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

// BUG run script dose not update the air
// TODO add crud operations for wallets
// TODO add auth
// TODO look into setting up generic repo
// TODO add validation on the dtos
