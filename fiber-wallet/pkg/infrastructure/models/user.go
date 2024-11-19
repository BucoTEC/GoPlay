package models

import (
	"gorm.io/gorm"
)

// User represents a user model in the database
// @Description A user in the system
// @ID User
// @Properties
// @Property  id        integer  "ID"
// @Property  createdAt string   "CreatedAt"
// @Property  updatedAt string   "UpdatedAt"
// @Property  deletedAt string   "DeletedAt"
type User struct {
	gorm.Model
	FirstName string    `gorm:"not null;" validate:"required" json:"first_name"`
	LastName  string    `gorm:"not null" validate:"required" json:"last_name"`
	Email     string    `gorm:"not null;uniqueIndex;size:255" validate:"required,email"`
	Password  string    `gorm:"not null;size:255" validate:"required,min=8"`
	Wallets   []*Wallet `gorm:"many2many:user_wallets"`
}
