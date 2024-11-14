package wallet

import "github.com/BucoTEC/fiber-wallet/pkg/infrastructure/models"

type Service interface {
	GetWalletById(Id string)
	DeleteWallet(Id string)
	CreateWallet(wallet models.Wallet)
	UpdateWallet(wallet models.Wallet, Id string)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{
		repo: repo,
	}
}

func (r *service) GetWalletById(Id string) {

}

func (r *service) DeleteWallet(Id string) {

}

func (r *service) CreateWallet(wallet models.Wallet) {

}

func (r *service) UpdateWallet(wallet models.Wallet, Id string) {

}
