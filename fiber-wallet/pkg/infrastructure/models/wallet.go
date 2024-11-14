package models

import (
	"gorm.io/gorm"
)

type Wallet struct {
	gorm.Model
	WalletName string
	Users      []*User `gorm:"many2many:user_wallets"`
}
