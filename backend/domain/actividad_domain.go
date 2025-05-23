package domain

type Activity struct {
	ID          int    `json:"id" gorm:"primary_key"`
	Name        string `json:"name"` // Ej: "Zumba", "Musculación"
	Profesor    string `json:"profesor"`
	Categoria   string `json:"categoria"`                   // Ej: "Aeróbico", "Fuerza"
	Cupos       int    `json:"cupos"`                       // Ej: 10, 20
	Description string `json:"description" gorm:"not_null"` // Opcional
	Dia         int    `json:"dia"`                         // Días y horarios en que se repite la actividad
	HoraInicio  string `json:"hora_inicio"`                 // Ej: "08:00", "10:30"
	HoraFin     string `json:"hora_fin"`                    // Ej: "09:00", "11:30"
}
