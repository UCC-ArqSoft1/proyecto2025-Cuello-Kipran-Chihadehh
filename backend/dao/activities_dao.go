package dao

type Activity struct {
	ID_actividad int    `gorm:"primary_key"`
	Nombre       string `gorm:"unique"`
	Profesor     int
	Id_usuario   int
	Cupos        int
	Id_categoria int
	Id_horario   int
	Descripcion  string
}

type TimeSlot struct {
	ID_horario int `gorm:"primary_key"`
}

type Inscription struct {
	ID_inscripcion int `gorm:"primary_key"`
}
