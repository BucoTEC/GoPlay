package handlers

import (
	"github.com/BucoTEC/fiber-wallet/pkg/user"
	"github.com/gofiber/fiber/v2"
)

// SearchUsers godoc
// @Summary      Search users by email
// @Description  Retrieves a list of users based on the email query parameter.
//
//	If the email query parameter is missing, a 400 Bad Request error is returned.
//
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        email  query     string  true  "Email address of the user to search for"
// @Failure      400    {object}  HTTPError  "Bad request, missing email query parameter"
// @Failure      500    {object}  HTTPError  "Internal server error, failed to fetch users"
// @Response     200
// @Router       /users/search [get]
func SearchUsers(service user.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {

		// Extract email from query string
		email := c.Query("email")
		if email == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "email query parameter is required",
			})
		}

		// Create conditions map
		conditions := map[string]interface{}{
			"email": email,
			// Include additional conditions if needed, like soft-delete
			"deleted_at": nil,
		}

		// Call the service to search for users
		users, err := service.SearchUsers(conditions)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		// Return users as JSON
		return c.Status(fiber.StatusOK).JSON(users)
	}
}

// GetUserById godoc
// @Summary      Get user by ID
// @Description  Retrieves a user by their unique ID. If the user is not found, a 404 Not Found error is returned.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id   path      int  true  "User ID"
// @Failure      400  {object}  HTTPError  "Bad request, missing id path parameter"
// @Failure      404  {object}  HTTPError  "User not found"
// @Response     200
// @Router       /users/{id} [get]
func GetUserById(service user.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Extract the user ID from the path parameter
		id := c.Params("id")
		if id == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "id path parameter is required",
			})
		}

		// Call the service to get the user by ID
		user := service.GetUserById(id)

		// If no user is found, return a 404 Not Found
		if user.ID == 0 {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "user not found",
			})
		}

		// Return the user as JSON
		return c.Status(fiber.StatusOK).JSON(user)
	}
}

func CreateUser(service user.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var createUserPayload user.CreateUserRequest

		// Parse JSON body into user model
		if err := c.BodyParser(&createUserPayload); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request payload"})
		}

		res, err := service.CreateUser(&createUserPayload)

		// Call the CreateUser method on the service
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "could not create user", "message": err.Error()})
		}

		// Respond with success message
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "user created successfully", "user": res})
	}
}

// UpdateUser godoc
// @Summary      Update user details
// @Description  Updates the details of an existing user. This requires the user ID and the data to be updated.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id   path      int    true  "User ID"
// @Success      200
// @Failure      400  {object}  HTTPError  "Invalid request, missing parameters"
// @Failure      404  {object}  HTTPError  "User not found"
// @Failure      500  {object}  HTTPError  "Internal server error"
// @Router       /users/{id} [put]
func UpdateUser(service user.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("update user")
	}
}

// DeleteUser godoc
// @Summary      Delete a user
// @Description  Deletes an existing user based on the user ID provided in the path parameter.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id   path      int    true  "User ID"
// @Success      200  {string}  string "User successfully deleted"
// @Failure      400  {object}  HTTPError  "Invalid request, missing parameters or deletion error"
// @Failure      404  {object}  HTTPError  "User not found"
// @Failure      500  {object}  HTTPError  "Internal server error"
// @Router       /users/{id} [delete]
func DeleteUser(service user.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		if id == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "id path parameter is required",
			})
		}

		if err := service.DeleteUser(id); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err})
		}

		return c.Status(fiber.StatusOK).SendString("delete user")
	}
}

// HTTPError represents a standard error response
// @Description A standard error response structure
type HTTPError struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
}
