package dao

type User struct {
	ID           int    `gorm:"primary_key"`
	Name         string `gorm:"not_null"`
	Username     string `gorm:"unique"`
	PasswordHash string `gorm:"not_null"`
	IsAdmin      bool   `gorm:"default:false"`
}
