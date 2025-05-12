package main

import (
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/controllers"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/domain"
)

func mostrar(user domain.Usuario) {
	println(user.ID_usuario, "\n",
		user.ID_usuario,
		"\n",
		user.Contraseña)
	return
}
func main() {
	var usuario1 = domain.Usuario{
		ID_usuario: 1,
		Username:   "ismael",
		Contraseña: "12345678",
		Is_admin:   false,
	}
	var user = controllers.RegisterUser(usuario1)
	mostrar(user)
}
