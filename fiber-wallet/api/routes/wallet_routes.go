package routes

import (
	"github.com/BucoTEC/fiber-wallet/api/handlers"
	"github.com/BucoTEC/fiber-wallet/pkg/wallet"
	"github.com/gofiber/fiber/v2"
)

func WalletRoutes(app fiber.Router, service wallet.Service) {
	// GetOrderByCode
	//
	//	@Summary		Getting Order by Code
	//	@Description	Getting Order by Code in detail
	//	@Tags			Orders
	//	@Accept			json
	//	@Produce		json
	//	@Param			x-correlationid	header		string	true	"code of Order"
	//	@Param			orderCode		path		string	true	"code of Order"
	//	@Success		200				{string}	string
	//	@Router			/orders/code/{orderCode} [get]
	userRoutes := app.Group("/wallets")
	userRoutes.Get("/", handlers.SearchWallets())
	userRoutes.Get("/:id", handlers.GetWallet())
	userRoutes.Post("/", handlers.CreateWallet())
	userRoutes.Put("/:id", handlers.UpdateWallet())
	userRoutes.Delete("/:id", handlers.DeleteWallet())
}
