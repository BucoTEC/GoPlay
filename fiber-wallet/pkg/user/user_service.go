package user

import (
	"fmt"

	"github.com/BucoTEC/fiber-wallet/pkg/infrastructure/models"
)

type Service interface {
	CreateUser(user *models.User) error
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

func (s *service) CreateUser(user *models.User) error {
	conditions := map[string]interface{}{
		"email":      user.Email,
		"deleted_at": nil,
	}
	users, err := s.repo.SearchUsers(conditions)
	if err != nil {
		return err
	}

	if len(*users) > 0 {
		return fmt.Errorf("user with this email already exists")
	}

	return s.repo.CreateUser(user)
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
