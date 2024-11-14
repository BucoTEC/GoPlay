package user

import "github.com/BucoTEC/fiber-wallet/pkg/infrastructure/models"

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
	return s.repo.CreateUser(user)
}
