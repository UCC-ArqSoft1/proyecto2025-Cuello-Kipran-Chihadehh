package services

import (
	"fmt"

	"proyecto2025-Cuello-Kipran-Chihadehh/backend/clients"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/utils"
)

func Login(username string, password string) (int, string, error) {
	userDAO, err := clients.NewMysqlClient().GetUserByUsername(username)
	if err != nil {
		return 0, "", fmt.Errorf("error getting user: %w", err)
	}
	if utils.HashSHA256(password) != userDAO.PasswordHash {
		return 0, "", fmt.Errorf("invalid password")
	}
	token, err := utils.GenerateJWT(userDAO.ID_usuario)
	if err != nil {
		return 0, "", fmt.Errorf("error generating token: %w", err)
	}
	return userDAO.ID_usuario, token, nil
}
