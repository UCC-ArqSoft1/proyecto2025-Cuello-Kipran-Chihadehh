package domain

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	UserID int    `json:"user_id"`
	Token  string `json:"token"`
}
