package dao

import "time"

type User struct {
	ID_usuario   int       `gorm:"primary_key;auto_increment" json:"id_usuario"`
	Username     string    `gorm:"unique;not null;size:50" json:"username"`
	PasswordHash string    `gorm:"not null;column:password_hash" json:"-"` // El "-" evita que aparezca en JSON
	Is_admin     bool      `gorm:"default:false" json:"is_admin"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relaciones
	Activities   []Activity    `gorm:"foreignKey:Id_usuario" json:"-"` // Actividades creadas por el usuario
	Inscriptions []Inscription `gorm:"foreignKey:ID_usuario" json:"-"` // Inscripciones del usuario
}
