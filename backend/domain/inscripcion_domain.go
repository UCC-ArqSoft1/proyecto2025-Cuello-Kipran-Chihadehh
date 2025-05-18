package domain

type Inscripcion struct {
	Id    int    `gorm:"primaryKey"`
	Fecha string `gorm:"type:varchar(250);not null"`

	Usuario   Usuario `gorm:"foreignkey:UsuarioId"`
	UsuarioId int

	ActDeportiva ActDeportiva `gorm:"foreignkey:ActividadId"`
	ActividadId  int
}

type Inscripciones []Inscripcion
