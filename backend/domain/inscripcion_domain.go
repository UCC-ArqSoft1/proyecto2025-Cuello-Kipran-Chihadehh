package domain

type Inscripcion struct {
	Id int `gorm:"primaryKey"`

	Usuario   Usuario `gorm:"foreignkey:UsuarioId"`
	UsuarioId int

	ActDeportiva ActDeportiva `gorm:"foreignkey:ActividadId"`
	ActividadId  int
}

type Inscripciones []Inscripcion
