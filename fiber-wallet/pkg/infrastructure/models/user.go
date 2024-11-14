package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FirstName string    `gorm:"not null;" validate:"required"`
	LastName  string    `gorm:"not null" validate:"required"`
	Email     string    `gorm:"not null;uniqueIndex;size:255" validate:"required,email"`
	Password  string    `gorm:"not null;size:255" validate:"required,min=8"`
	Wallets   []*Wallet `gorm:"many2many:user_wallets"`
}
