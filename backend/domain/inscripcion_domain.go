package domain

type Inscripcion struct {
	Id int `gorm:"primaryKey"`

	Usuario   User `gorm:"foreignkey:UsuarioId"`
	UsuarioId int

	ActDeportiva Activity `gorm:"foreignkey:ActividadId"`
	ActividadId  int
}

type Inscripciones []Inscripcion
