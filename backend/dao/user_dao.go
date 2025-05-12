package dao

type User struct {
	ID_usuario   int    `gorm:"primary_key"`
	Username     string `gorm:"unique"`
	PasswordHash string `gorm:"not_null"`
}
