package domain

type Usuario struct {
	ID_usuario int    `gorm:"primary_key"`
	ID_token   int    `gorm:"foreign_key:ID_token"`
	Username   string `gorm:"type:varchar(250);not null"`
	Contraseña string `gorm:"type:varchar(250);not null"`
	Is_admin   bool
}
