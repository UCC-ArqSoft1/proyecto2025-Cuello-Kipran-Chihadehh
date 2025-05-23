package dao

type Activity struct {
	ID_actividad int    `gorm:"primary_key;auto_increment"` // Cambiado para MySQL
	Nombre       string `gorm:"unique;not null;size:100"`
	Profesor     string `gorm:"not null;size:100"`  // Nombre del profesor
	Cupos        int    `gorm:"not null;default:1"` // Cupos disponibles
	Categoria    string `gorm:"not null;size:100"`  // Categoría de la actividad
	Descripcion  string `gorm:"type:text"`
	Dia          string `gorm:"not null;size:20"` // Día de la semana
	Hora_inicio  string `gorm:"not null;size:20"` // Hora de inicio
	Hora_fin     string `gorm:"not null;size:20"` // Hora de fin
}

type Activities []Activity
