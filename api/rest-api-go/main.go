package main

import (
	"fmt"
	"log"

	_ "rest-api-go/docs" // Import the generated docs package

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
)

// @title Fiber Example API
// @version 1.0
// @description This is a sample Swagger for Fiber
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.email fiber@swagger.io
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:3001
// @BasePath /api/v1
func main() {
	// Initialize a new Fiber app
	app := fiber.New()

	// Swagger Documentation route
	app.Get("/swagger/*", swagger.HandlerDefault)

	// Routes
	app.Get("/", rootHandler)
	app.Get("/:id", getByIdHandler)
	app.Put("/:id", updateHandler)
	app.Delete("/", deleteHandler)
	app.Get("/search", searchHandler)

	// Start the server on port 3001
	log.Fatal(app.Listen(":3001"))
}

// @Summary Root Endpoint
// @Description Returns a hello message
// @Tags Root
// @Accept json
// @Produce json
// @Success 200 {string} string "Hello, World"
// @Router / [get]
func rootHandler(c *fiber.Ctx) error {
	contentType := c.Get("Content-Type")
	res := fmt.Sprintf("Hello, World 👋! %s", contentType)
	return c.SendString(res)
}

// @Summary Get an entity by ID
// @Description Retrieve an entity using its ID
// @Tags Entity
// @Accept json
// @Produce json
// @Param id path string true "Entity ID"
// @Success 200 {string} string "Hello, World {id}"
// @Router /{id} [get]
func getByIdHandler(c *fiber.Ctx) error {
	id := c.Params("id")
	res := fmt.Sprintf("Hello, World 👋! %s", id)
	return c.Status(fiber.StatusOK).SendString(res)
}

// @Summary Update an entity by ID
// @Description Updates an existing entity
// @Tags Entity
// @Accept json
// @Produce json
// @Param id path string true "Entity ID"
// @Success 200 {string} string "Entity Updated"
// @Router /{id} [put]
func updateHandler(c *fiber.Ctx) error {
	id := c.Params("id")
	res := fmt.Sprintf("Entity Updated: %s", id)
	return c.SendString(res)
}

// @Summary Delete an entity
// @Description Deletes an entity
// @Tags Entity
// @Accept json
// @Produce json
// @Param id query string true "Entity ID"
// @Success 200 {string} string "Entity Deleted"
// @Router / [delete]
func deleteHandler(c *fiber.Ctx) error {
	id := c.Query("id")
	res := fmt.Sprintf("Entity Deleted: %s", id)
	return c.Status(fiber.StatusOK).SendString(res)
}

// @Summary Search entities
// @Description Search entities with sorting options
// @Tags Search
// @Accept json
// @Produce json
// @Param sort-by-date query string false "Sort by date" Enums(newest-first, oldest-first)
// @Success 200 {string} string "Sorted results"
// @Router /search [get]
func searchHandler(c *fiber.Ctx) error {
	sortByDate := c.Query("sort-by-date", "newest-first")
	res := fmt.Sprintf("Search Results Sorted By: %s", sortByDate)
	return c.SendString(res)
}
