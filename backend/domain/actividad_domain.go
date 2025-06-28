package domain

type Activity struct {
	ID          int    `json:"id" gorm:"primary_key"`
	Name        string `json:"name"` // Ej: "Zumba", "Musculación"
	Profesor    string `json:"profesor"`
	Cupos       int    `json:"cupos"`       // Ej: 10, 20
	Categoria   string `json:"categoria"`   // Ej: "Aeróbico", "Fuerza"
	Description string `json:"description"` // Opcional
	Dia         int    `json:"dia"`         // Días en que se repite la actividad
	HoraInicio  string `json:"hora_inicio"` // Ej: "08:00", "10:30"
	HoraFin     string `json:"hora_fin"`    // Ej: "09:00", "11:30"
}

type ActivityResponse struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Profesor    string `json:"profesor"`
	Categoria   string `json:"categoria"`
	Cupos       int    `json:"cupos"`
	Description string `json:"description"`
	Dia         int    `json:"dia"`
	HoraInicio  string `json:"hora_inicio"`
	HoraFin     string `json:"hora_fin"`
}
