package services

import (
	"fmt"

	"proyecto2025-Cuello-Kipran-Chihadehh/backend/dao"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/utils"
)

type UserClient interface {
	GetUserByUsername(username string) (dao.User, error)
	GetUserByID(userID int) (dao.User, error)
	CreateUser(user dao.User) (dao.User, error)
}

type UserService struct {
	UserClient UserClient
}

func NewUserService(userClient UserClient) *UserService {
	return &UserService{
		UserClient: userClient,
	}
}
func (s *UserService) GetUserByUsername(username string) (dao.User, error) {
	userDAO, err := s.UserClient.GetUserByUsername(username)
	if err != nil {
		return dao.User{}, fmt.Errorf("error getting user: %w", err)
	}
	return userDAO, nil
}
func (s *UserService) CreateUser(user dao.User) (dao.User, error) {
	userDAO, err := s.UserClient.CreateUser(user)
	if err != nil {
		return dao.User{}, fmt.Errorf("error creating user: %w", err)
	}
	return userDAO, nil
}
func (s *UserService) GenerateJWT(userID int) (string, error) {
	token, err := utils.GenerateJWT(userID)
	if err != nil {
		return "", fmt.Errorf("error generating token: %w", err)
	}
	return token, nil
}

func (s *UserService) Login(username string, password string) (int, string, error, bool) {
	userDAO, err := s.UserClient.GetUserByUsername(username)
	if err != nil {
		return 0, "", fmt.Errorf("error getting user: %w", err), false
	}
	if utils.HashSHA256(password) != userDAO.PasswordHash {
		return 0, "", fmt.Errorf("invalid password"), false
	}
	token, err := utils.GenerateJWT(userDAO.ID_usuario)
	if err != nil {
		return 0, "", fmt.Errorf("error generating token: %w", err), false
	}
	return userDAO.ID_usuario, token, nil, userDAO.Is_admin
}
