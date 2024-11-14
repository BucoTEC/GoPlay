package user

import "gorm.io/gorm"

type Repository interface {
	GetUserById(Id string)
	DeleteUser(Id string)
	CreateUser(user User)
	UpdateUser(user User, Id string)
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

func (r *repository) CreateUser(user User) {

}

func (r *repository) UpdateUser(user User, Id string) {

}
