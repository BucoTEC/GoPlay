package wallet

import "gorm.io/gorm"

type Wallet struct {
	gorm.Model
	WalletName string
}
