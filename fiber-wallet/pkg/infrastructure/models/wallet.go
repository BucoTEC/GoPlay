package models

import (
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type Wallet struct {
	gorm.Model
	WalletName string
	Balance    decimal.Decimal `gorm:"type:decimal(20,8)"` // Up to 20 digits with 8 decimal places
	Users      []*User         `gorm:"many2many:user_wallets"`
}
