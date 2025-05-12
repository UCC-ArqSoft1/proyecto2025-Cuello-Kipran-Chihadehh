package clients

import (
	"fmt"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/dao"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type MysqlClient struct {
	DB *gorm.DB
}

func NewMysqlClient() *MysqlClient {
	dsnFormat := "%s: %s@tcp(%s:%s)/%s?parseTime=true&charset=utf8mb4&loc=Local"
	dsn := fmt.Sprintf(dsnFormat, "root", "root", "127.0.0.1", 3306, "backend")
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(fmt.Errorf("failed to connect to database: %v", err))
	}
	for _, table := range []interface{}{
		dao.User{},
		dao.Activity{},
		dao.TimeSlot{},
		dao.Inscription{},
	} {
		if err := db.AutoMigrate(table); err != nil {
			panic(fmt.Errorf("failed to migrate table: %v", err))
		}
	}
	return &MysqlClient{
		DB: db,
	}
}

func (c *MysqlClient) GetUserByUsername(username string) (dao.User, error) {
	var userDAD dao.User
	//SELECT * FROM users WHERE username = "admin" LIMIT 1
	txn := c.DB.First(&userDAD, "username = ?", username)
	if txn.Error != nil {
		return dao.User{}, fmt.Errorf("error getting user: %w", txn.Error)
	}
	return userDAD, nil
}
