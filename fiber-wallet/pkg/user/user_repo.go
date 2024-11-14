package user

import (
	"github.com/BucoTEC/fiber-wallet/pkg/infrastructure/models"
	"gorm.io/gorm"
)

type Repository interface {
	GetUserById(Id string)
	DeleteUser(Id string)
	CreateUser(user models.User)
	UpdateUser(user models.User, Id string)
}

type repository struct {
	db *gorm.DB
}

func NewRepo(db *gorm.DB) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) GetUserById(Id string) {

}

func (r *repository) DeleteUser(Id string) {

}

func (r *repository) CreateUser(user models.User) {

}

func (r *repository) UpdateUser(user models.User, Id string) {

}
