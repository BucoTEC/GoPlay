package wallet

import "gorm.io/gorm"

type Repository interface {
	GetWalletById(Id string)
	DeleteWallet(Id string)
	CreateWallet(wallet Wallet)
	UpdateWallet(wallet Wallet, Id string)
}

type repository struct {
	db *gorm.DB
}

func NewRepo(db *gorm.DB) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) GetWalletById(Id string) {

}

func (r *repository) DeleteWallet(Id string) {

}

func (r *repository) CreateWallet(wallet Wallet) {

}

func (r *repository) UpdateWallet(wallet Wallet, Id string) {

}
