package wallet

import (
	"github.com/BucoTEC/fiber-wallet/pkg/infrastructure/models"
	"gorm.io/gorm"
)

type Repository interface {
	GetWalletById(Id string)
	DeleteWallet(Id string)
	CreateWallet(wallet models.Wallet)
	UpdateWallet(Wallet models.Wallet, Id string)
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

func (r *repository) CreateWallet(Wallet models.Wallet) {

}

func (r *repository) UpdateWallet(Wallet models.Wallet, Id string) {

}
