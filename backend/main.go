package main

import (
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/controllers"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/domain"
)

func mostrar(user domain.Usuario) {
	println(user.ID_usuario, "\n",
		user.Mail,
		"\n",
		user.Contraseña)
	return
}
func main() {
	var usuario1 = domain.Usuario{
		ID_usuario: 1,
		Nombre:     "juan",
		Apellido:   "perez",
		DNI:        46032879,
		Mail:       "agus123@gmail.com",
		Contraseña: "12345678",
		Is_admin:   false,
	}
	var user = controllers.RegisterUser(usuario1)
	mostrar(user)
}
