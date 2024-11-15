package user

import (
	"fmt"

	"github.com/BucoTEC/fiber-wallet/pkg/infrastructure/models"
	"gorm.io/gorm"
)

type Repository interface {
	GetUserById(Id string) models.User
	DeleteUser(Id string)
	SearchUsers(searchCondition map[string]interface{}) ([]models.User, error)
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

func (r *repository) GetUserById(Id string) models.User {
	var user models.User
	r.db.First(&user, Id)
	return user
}

func (r *repository) SearchUsers(searchCondition map[string]interface{}) ([]models.User, error) {
	var users []models.User

	// Query the database with a one-liner error check
	if err := r.db.Where(searchCondition).Find(&users).Error; err != nil {
		return nil, fmt.Errorf("error searching users: %w", err)
	}

	return users, nil
}

func (r *repository) DeleteUser(Id string) {

}

func (r *repository) CreateUser(user models.User) error {

	var existingUser models.User

	if err := r.db.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		return fmt.Errorf("user with this email already exists")
	}

	result := r.db.Create(&user)
	return result.Error
}

func (r *repository) UpdateUser(user models.User, Id string) {

}
