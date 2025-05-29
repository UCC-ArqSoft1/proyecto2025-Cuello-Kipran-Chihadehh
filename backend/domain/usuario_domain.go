package domain

type User struct {
	ID       int    `json:"id"`
	name     string `json:"name"`
	Username string `json:"username"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"is_admin"`
}
