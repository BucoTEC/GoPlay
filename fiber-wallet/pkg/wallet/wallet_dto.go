package wallet

type CreateWallet struct {
	WalletName string `json:"wallet_name"`
	OwnerId    uint   `json:"owner_id"`
}
