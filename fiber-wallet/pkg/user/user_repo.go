package user

import (
	"fmt"

	"github.com/BucoTEC/fiber-wallet/pkg/infrastructure/models"
	"gorm.io/gorm"
)

type Repository interface {
	GetUserById(Id string)
	DeleteUser(Id string)
	CreateUser(user models.User) error
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

func (r *repository) CreateUser(user models.User) error {

	var existingUser models.User

	// Check if a user with the given email already exists
	if err := r.db.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		return fmt.Errorf("user with this email already exists")
	}

	// If no user found, create a new user
	result := r.db.Create(&user)
	return result.Error
}

func (r *repository) UpdateUser(user models.User, Id string) {

}
