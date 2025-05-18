package dao

import "time"

type Categoria struct {
	ID_categoria int       `gorm:"primary_key;auto_increment" json:"id_categoria"`
	Nombre       string    `gorm:"unique;not null;size:100" json:"nombre"`
	Descripcion  string    `gorm:"type:text" json:"descripcion"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relaciones
	Activities []Activity `gorm:"foreignKey:Id_categoria" json:"-"` // Actividades de esta categoría
}
