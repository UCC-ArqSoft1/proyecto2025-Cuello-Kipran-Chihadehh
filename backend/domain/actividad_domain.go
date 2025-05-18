package domain

type ActDeportiva struct {
	ID_actividad int
	Nombre       string
	Profesor     int
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

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	UserID int    `json:"user_id"`
	Token  string `json:"token"`
}
