package domain

type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Username string `json:"username"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"is_admin"`
	Token    string `json:"token"` // Token opcional para autenticación
}

type UserResponse struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	IsAdmin  bool   `json:"is_admin"`
}
