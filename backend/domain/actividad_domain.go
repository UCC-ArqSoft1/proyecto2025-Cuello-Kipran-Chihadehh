package domain

import (
	"time"
)

type Activity struct {
	ID_actividad int
	Nombre       string
	Profesor     string
	Cupos        int
	Categoria    string
	ID_timeslot  TimeSlot
	Descripcion  string
}

type TimeSlot struct {
	ID_horario  int
	Dia         string
	Hora_inicio time.Time
	Hora_fin    time.Time
}
