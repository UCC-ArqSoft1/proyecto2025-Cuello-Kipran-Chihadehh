package domain

type Usuario struct {
	ID_usuario int    `gorm:"primary_key"`
	Username   string `gorm:"type:varchar(250);not null"`
	Contraseña string `gorm:"type:varchar(250);not null"`
	Is_admin   bool
}
