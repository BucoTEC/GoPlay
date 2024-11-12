package user

type Repository interface {
	GetUserById(Id string)
	DeleteUser(Id string)
	CreateUser(user User)
	UpdateUser(user User, Id string)
}
