package wallet

type Service interface {
	GetWalletById(Id string)
	DeleteWallet(Id string)
	CreateWallet(wallet Wallet)
	UpdateWallet(wallet Wallet, Id string)
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

func (r *service) CreateWallet(wallet Wallet) {

}

func (r *service) UpdateWallet(wallet Wallet, Id string) {

}
