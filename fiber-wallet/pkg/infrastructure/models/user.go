package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FirstName string    `gorm:"not null;" validate:"required" json:"first_name"`
	LastName  string    `gorm:"not null" validate:"required" json:"last_name"`
	Email     string    `gorm:"not null;uniqueIndex;size:255" validate:"required,email"`
	Password  string    `gorm:"not null;size:255" validate:"required,min=8"`
	Wallets   []*Wallet `gorm:"many2many:user_wallets"`
}
