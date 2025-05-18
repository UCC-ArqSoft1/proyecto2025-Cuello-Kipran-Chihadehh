package dao

import "time"

// Categoría de actividades (funcional, spinning, MMA, etc.)
type Category struct {
	ID_categoria int       `gorm:"primary_key;auto_increment" json:"id_categoria"`
	Nombre       string    `gorm:"unique;not null;size:100" json:"nombre"`
	Descripcion  string    `gorm:"type:text" json:"descripcion"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relaciones
	Activities []Activity `gorm:"foreignKey:Id_categoria" json:"-"` // Actividades de esta categoría
}

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
	ID_actividad int       `gorm:"primary_key;auto_increment" json:"id_actividad"`
	Nombre       string    `gorm:"unique;not null;size:100" json:"nombre"`
	Descripcion  string    `gorm:"type:text" json:"descripcion"`
	Profesor     string    `gorm:"not null;size:100" json:"profesor"` // Nombre del profesor
	Cupos        int       `gorm:"not null;default:1" json:"cupos"`   // Cupos disponibles
	Precio       float64   `gorm:"type:decimal(10,2)" json:"precio"`  // Precio de la actividad
	Imagen_url   string    `gorm:"size:255" json:"imagen_url"`        // URL de la imagen
	Activa       bool      `gorm:"default:true" json:"activa"`        // Si está disponible
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Foreign Keys
	Id_usuario   int `gorm:"not null" json:"id_usuario"`   // Usuario que creó la actividad (admin)
	Id_categoria int `gorm:"not null" json:"id_categoria"` // Categoría de la actividad
	Id_horario   int `gorm:"not null" json:"id_horario"`   // Horario de la actividad

	// Relaciones
	Usuario      User          `gorm:"foreignKey:Id_usuario;constraint:OnDelete:CASCADE" json:"-"`
	Categoria    Category      `gorm:"foreignKey:Id_categoria;constraint:OnDelete:CASCADE" json:"categoria"`
	Horario      TimeSlot      `gorm:"foreignKey:Id_horario;constraint:OnDelete:CASCADE" json:"horario"`
	Inscriptions []Inscription `gorm:"foreignKey:ID_actividad" json:"-"` // Inscripciones a esta actividad
}

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
	Usuario   User     `gorm:"foreignKey:ID_usuario;constraint:OnDelete:CASCADE" json:"-"`
	Actividad Activity `gorm:"foreignKey:ID_actividad;constraint:OnDelete:CASCADE" json:"actividad"`

	// Índice compuesto para evitar inscripciones duplicadas
	// Un usuario no puede inscribirse dos veces a la misma actividad
}

// Configuración adicional para índices únicos compuestos
func (Inscription) TableName() string {
	return "inscriptions"
}

// Para GORM - definir índices
func (Inscription) BeforeCreate() {
	// Se puede agregar lógica adicional antes de crear una inscripción
}
