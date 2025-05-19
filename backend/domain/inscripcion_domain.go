package domain

type Inscripcion struct {
	Id int `gorm:"primaryKey"`

	Usuario   Usuario `gorm:"foreignkey:UsuarioId"`
	UsuarioId int

	ActDeportiva Activity `gorm:"foreignkey:ActividadId"`
	ActividadId  int
}

type Inscripciones []Inscripcion
