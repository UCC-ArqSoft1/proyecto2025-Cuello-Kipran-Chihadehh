package dao

import "time"

// Horarios disponibles (día y horas)
type TimeSlot struct {
	ID_horario  int       `gorm:"primary_key;auto_increment" json:"id_horario"`
	Dia         string    `gorm:"not null;size:20" json:"dia"`           // Lunes, Martes, etc.
	Hora_inicio time.Time `gorm:"type:time;not null" json:"hora_inicio"` // 14:00:00
	Hora_fin    time.Time `gorm:"type:time;not null" json:"hora_fin"`    // 15:30:00
	Duracion    int       `gorm:"not null" json:"duracion"`              // Duración en minutos
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relaciones
	Activities []Activity `gorm:"foreignKey:Id_horario" json:"-"` // Actividades en este horario
}

// Actividad deportiva
type Activity struct {
	ID_actividad int    `gorm:"primary_key;auto_increment" json:"id_actividad"`
	Nombre       string `gorm:"unique;not null;size:100" json:"nombre"`
	Profesor     string `gorm:"not null;size:100" json:"profesor"`  // Nombre del profesor
	Cupos        int    `gorm:"not null;default:1" json:"cupos"`    // Cupos disponibles
	Categoria    string `gorm:"not null;size:100" json:"categoria"` // Categoría de la actividad
	Fecha        string `gorm:"not null;size:10" json:"fecha"`      // Fecha de la actividad
	Hora_inicio  string `gorm:"not null;size:5" json:"hora_inicio"` // Hora de inicio (HH:MM)
	Duracion     string `gorm:"not null;size:5" json:"duracion"`    // Duración de la actividad (HH:MM)
	Descripcion  string `gorm:"type:text" json:"descripcion"`
}
