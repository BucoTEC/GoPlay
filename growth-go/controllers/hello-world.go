package controllers

import "github.com/gofiber/fiber/v2"

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
func HelloWorld(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"hello": "world"})
}
