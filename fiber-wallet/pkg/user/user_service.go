package user

import (
	"fmt"

	"github.com/BucoTEC/fiber-wallet/pkg/infrastructure/models"
	"github.com/jinzhu/copier"
)

type Service interface {
	CreateUser(user *CreateUserRequest) (*UserResponse, error)
	GetUserById(Id string) *models.User
	SearchUsers(conditions map[string]interface{}) (*[]models.User, error)
	DeleteUser(Id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{
		repo: repo,
	}
}

func (s *service) CreateUser(data *CreateUserRequest) (*UserResponse, error) {
	// Check if a user with the same email already exists
	conditions := map[string]interface{}{
		"email":      data.Email,
		"deleted_at": nil,
	}
	users, err := s.repo.SearchUsers(conditions)
	if err != nil {
		return nil, fmt.Errorf("failed to search users: %w", err)
	}

	if len(*users) > 0 {
		return nil, fmt.Errorf("user with email %s already exists", data.Email)
	}

	// Map CreateUserRequest to the User model
	user := &models.User{}
	if err := copier.Copy(user, data); err != nil {
		return nil, fmt.Errorf("failed to map request data to user model: %w", err)
	}

	// Create the user in the repository
	if err := s.repo.CreateUser(user); err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	// Map the created user to UserResponse
	response := &UserResponse{}
	if err := copier.Copy(response, user); err != nil {
		return nil, fmt.Errorf("failed to map user model to response: %w", err)
	}

	return response, nil
}

func (s *service) SearchUsers(conditions map[string]interface{}) (*[]models.User, error) {
	users, err := s.repo.SearchUsers(conditions)
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (s *service) GetUserById(Id string) *models.User {
	return s.repo.GetUserById(Id)
}

func (s *service) DeleteUser(Id string) error {
	user := s.GetUserById(Id)

	if user.ID == 0 {
		return fmt.Errorf("no user found with provided id")
	}

	return s.repo.DeleteUser(user)
}
