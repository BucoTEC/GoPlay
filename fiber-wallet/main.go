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
	app.Get("/", HealthCheck)
	routes.UserRouter(v1, userService)
	routes.WalletRoutes(v1, walletService)

	app.Listen(":3000")
}

func configureV1(app fiber.Router) fiber.Router {
	api := app.Group("/api")
	v1 := api.Group("/v1")
	return v1
}

// HealthCheck godoc
// @Summary Show the status of server.
// @Description get the status of server.
// @Tags root
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router / [get]
func HealthCheck(c *fiber.Ctx) error {
	res := map[string]interface{}{
		"data": "Server is up and running",
	}

	if err := c.JSON(res); err != nil {
		return err
	}

	return nil
}

// TODO add dtos for the user routes
// TODO validate project structure and possible use of the cmd folder
// TODO add crud operations for wallets
// TODO add auth
// TODO look into setting up generic repo
// TODO add validation on the dtos
