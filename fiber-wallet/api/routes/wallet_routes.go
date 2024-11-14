package routes

import (
	"github.com/BucoTEC/fiber-wallet/api/handlers"
	"github.com/BucoTEC/fiber-wallet/pkg/wallet"
	"github.com/gofiber/fiber/v2"
)

func WalletRoutes(app fiber.Router, service wallet.Service) {
	userRoutes := app.Group("/wallets")
	userRoutes.Get("/", handlers.SearchWallets())
	userRoutes.Get("/:id", handlers.GetWallet())
	userRoutes.Post("/", handlers.CreateWallet())
	userRoutes.Put("/:id", handlers.UpdateWallet())
	userRoutes.Delete("/:id", handlers.DeleteWallet())
}
