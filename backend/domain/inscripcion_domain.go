package domain

type Inscripcion struct {
	Id int `gorm:"primaryKey"`

	Usuario   User `gorm:"foreignkey:UsuarioId"`
	UsuarioId int

	Actividad   Activity `gorm:"foreignkey:ActividadId"`
	ActividadId int
}

type Inscripciones []Inscripcion

type InscripcionRequest struct {
	UsuarioId   int `json:"usuario_id" `
	ActividadId int `json:"actividad_id"`
}

// InscripcionResponse representa la estructura de respuesta para una inscripción
type InscripcionResponse struct {
	Id          int              `json:"id"`
	UsuarioId   int              `json:"usuario_id"`
	ActividadId int              `json:"actividad_id"`
	Usuario     UserResponse     `json:"usuario"`
	Actividad   ActivityResponse `json:"actividad"`
}
