package domain

type ActDeportiva struct {
	ID_actividad int
	Nombre       string
	Profesor     int
	Id_usuario   int
	Cupos        int
	Id_categoria int
	Id_horario   int
	Descripcion  string
	Horario      string
}
type categoria struct {
	ID_categoria int
	Nombre       string
}
type Horario struct {
	ID_horario  int
	Dia         string
	Hora_inicio string
	Hora_fin    string
}
type Usuario struct {
	ID_usuario int
	ID_token   int
	Nombre     string
	Apellido   string
	DNI        int
	Mail       string
	Contraseña string
	Is_admin   bool
}

type Token struct {
	Tiempo   int
	Id_token int
	Activo   bool
	Token    string
}
