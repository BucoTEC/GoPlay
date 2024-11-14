package infrastructure

import (
	"log"

	"github.com/BucoTEC/fiber-wallet/pkg/infrastructure/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DbInstance struct {
	Db *gorm.DB
}

var DB DbInstance

// connectDb
func ConnectDb() {
	dsn := "test.db"

	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Failed to connect to database. \n", err)
	}

	log.Println("connected")
	db.Logger = logger.Default.LogMode(logger.Info)
	log.Println("running migrations")
	db.AutoMigrate(&models.User{}, &models.Wallet{})

	DB = DbInstance{
		Db: db,
	}
}
