package domain

type ActDeportiva struct {
	ID_actividad int
	Nombre       string
	Profesor     string
	Id_usuario   int
	Cupos        int
	Id_categoria int
	Fecha        string
	Hora_inicio  string
	Duracion     string
	Descripcion  string
}

type Token struct {
	Tiempo   int
	Id_token int
	Activo   bool
	Token    string
}
