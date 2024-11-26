package wallet

import (
	"fmt"

	"github.com/BucoTEC/fiber-wallet/pkg/infrastructure/models"
	"gorm.io/gorm"
)

type Repository interface {
	GetWalletById(Id string) *models.Wallet
	DeleteWallet(Id string) error
	CreateWallet(wallet *models.Wallet) error
	UpdateWallet(Wallet *models.Wallet, Id string)
}

type repository struct {
	db *gorm.DB
}

func NewRepo(db *gorm.DB) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) GetWalletById(Id string) *models.Wallet {
	var wallet models.Wallet
	r.db.First(&wallet, Id)
	return &wallet
}

func (r *repository) DeleteWallet(Id string) error {
	return nil
}

func (r *repository) CreateWallet(wallet *models.Wallet) error {
	var existingWallet models.Wallet

	if err := r.db.Where("wallet_name = ?", wallet.WalletName).First(&existingWallet).Error; err == nil {
		return fmt.Errorf("wallet with this name already exists")
	}
	// TODO since wallet is going to be shared check also not only by wallet name but also owner id
	result := r.db.Create(&existingWallet)
	return result.Error
}

func (r *repository) UpdateWallet(Wallet *models.Wallet, Id string) {

}

// TODO investigate if lern go will help
