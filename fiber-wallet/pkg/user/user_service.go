package user

import (
	"fmt"

	"github.com/BucoTEC/fiber-wallet/pkg/infrastructure/models"
)

type Service interface {
	CreateUser(user models.User) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{
		repo: repo,
	}
}

func (s *service) CreateUser(user models.User) error {
	conditions := map[string]interface{}{
		"email":      user.Email,
		"deleted_at": nil,
	}
	users, err := s.repo.SearchUsers(conditions)
	if err != nil {
		return err
	}

	if len(users) > 0 {
		return fmt.Errorf("user with this email already exists")
	}

	return s.repo.CreateUser(user)
}
