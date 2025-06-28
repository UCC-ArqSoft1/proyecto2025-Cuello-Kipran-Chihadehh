package services

import (
	"backend/clients"
	"backend/dao"
	"backend/domain"
	"backend/utils"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
)

func Login(username, password string) (domain.User, error) {
	// Obtener el usuario por nombre de usuario
	userDao, err := clients.GetUserByUsername(username)
	if err != nil {
		return domain.User{}, fmt.Errorf("user not found with username %s: %w", username, err)
	}

	// Verificar la contraseña
	if userDao.PasswordHash != hashPassword(password) {
		return domain.User{}, errors.New("invalid password")
	}
	token, err := utils.GenerateJWT(userDao.ID)
	fmt.Printf("Generated token for user %s: %s\n", userDao.Username, token)
	if err != nil {
		return domain.User{}, fmt.Errorf("failed to generate token: %w", err)
	}
	return domain.User{
		ID:       userDao.ID,
		Name:     userDao.Name,
		Username: userDao.Username,
		IsAdmin:  userDao.IsAdmin,
		Token:    token,
	}, nil
}

// CreateUser crea un nuevo usuario con contraseña hasheada
func CreateUser(user domain.User) (domain.User, error) {
	// Validaciones básicas
	if user.Name == "" {
		return domain.User{}, errors.New("name cannot be empty")

	}
	if user.Username == "" {
		return domain.User{}, errors.New("username cannot be empty")
	}
	if user.Password == "" {
		return domain.User{}, errors.New("password cannot be empty")
	}

	// Verificar si el usuario ya existe
	_, err := clients.GetUserByUsername(user.Username)
	if err == nil {
		return domain.User{}, errors.New("username already exists")
	}

	// Hashear la contraseña
	hashedPassword := hashPassword(user.Password)

	// Crear el DAO object
	userDao := dao.User{
		Username:     user.Username,
		Name:         user.Name,
		PasswordHash: hashedPassword,
		IsAdmin:      user.IsAdmin,
	}

	// Guardar en la base de datos
	createdUser, err := clients.CreateUser(userDao)
	if err != nil {
		return domain.User{}, fmt.Errorf("failed to create user: %w", err)
	}

	return domain.User{
		ID:       createdUser.ID,
		Name:     createdUser.Name,
		Username: createdUser.Username,
		Password: "", // No devolvemos la contraseña
		IsAdmin:  createdUser.IsAdmin,
	}, nil
}

// hashPassword hashea una contraseña usando SHA256
func hashPassword(password string) string {
	hash := sha256.Sum256([]byte(password))
	return hex.EncodeToString(hash[:])
}

// verifyPassword verifica si una contraseña coincide con su hash
func verifyPassword(password, hash string) bool {
	return hashPassword(password) == hash
}
