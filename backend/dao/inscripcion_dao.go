package dao

import (
	"time"
)

// Inscripción de un usuario a una actividad
type Inscription struct {
	ID_inscripcion    int       `gorm:"primary_key;auto_increment" json:"id_inscripcion"`
	Fecha_inscripcion time.Time `gorm:"autoCreateTime" json:"fecha_inscripcion"`
	Estado            string    `gorm:"default:'activa';size:20" json:"estado"` // activa, cancelada, completada
	CreatedAt         time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt         time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Foreign Keys
	ID_usuario   int `gorm:"not null" json:"id_usuario"`
	ID_actividad int `gorm:"not null" json:"id_actividad"`

	// Relaciones
	Usuario   User     `gorm:"foreignKey:ID_usuario;constraint:OnDelete:CASCADE"`
	Actividad Activity `gorm:"foreignKey:ID_actividad;constraint:OnDelete:CASCADE" json:"actividad"`

	// Índice compuesto para evitar inscripciones duplicadas
	// Un usuario no puede inscribirse dos veces a la misma actividad
}
