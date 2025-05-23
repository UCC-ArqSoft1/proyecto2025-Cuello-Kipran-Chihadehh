package services

import (
	"backend/clients"
	"backend/domain"
	"errors"
	"fmt"
)

// GetUserByID obtiene un usuario por ID y lo convierte al formato domain
func GetUserByID(id int) (domain.User, error) {
	userDao, err := clients.GetUserByID(id)
	if err != nil {
		return domain.User{}, fmt.Errorf("user not found with id %d: %w", id, err)
	}

	return domain.User{
		ID:       userDao.ID,
		Username: userDao.Username,
		Password: "", // No devolvemos la contraseña hasheada
		IsAdmin:  userDao.IsAdmin,
	}, nil
}

// GetUserByUsername obtiene un usuario por username
func GetUserByUsername(username string) (domain.User, error) {
	userDao, err := clients.GetUserByUsername(username)
	if err != nil {
		return domain.User{}, fmt.Errorf("user not found with username %s: %w", username, err)
	}

	return domain.User{
		ID:       userDao.ID,
		Username: userDao.Username,
		Password: "", // No devolvemos la contraseña hasheada
		IsAdmin:  userDao.IsAdmin,
	}, nil
}

// ValidateUserCredentials valida las credenciales de un usuario para login
func ValidateUserCredentials(username, password string) (domain.User, error) {
	userDao, err := clients.GetUserByUsername(username)
	if err != nil {
		return domain.User{}, errors.New("invalid credentials")
	}

	// Verificar la contraseña
	if !verifyPassword(password, userDao.PasswordHash) {
		return domain.User{}, errors.New("invalid credentials")
	}

	return domain.User{
		ID:       userDao.ID,
		Username: userDao.Username,
		Password: "", // No devolvemos la contraseña
		IsAdmin:  userDao.IsAdmin,
	}, nil
}

// GetAllUsers obtiene todos los usuarios (solo para admins)
func GetAllUsers() ([]domain.User, error) {
	usersDao, err := clients.GetAllUsers()
	if err != nil {
		return nil, fmt.Errorf("failed to get users: %w", err)
	}

	var users []domain.User
	for _, userDao := range usersDao {
		users = append(users, domain.User{
			ID:       userDao.ID,
			Username: userDao.Username,
			Password: "", // No devolvemos la contraseña
			IsAdmin:  userDao.IsAdmin,
		})
	}

	return users, nil
}

// UpdateUser actualiza un usuario existente
func UpdateUser(user domain.User) error {
	// Obtener el usuario actual de la base de datos
	currentUser, err := clients.GetUserByID(user.ID)
	if err != nil {
		return fmt.Errorf("user not found: %w", err)
	}

	// Actualizar solo los campos que no están vacíos
	if user.Username != "" {
		currentUser.Username = user.Username
	}
	if user.Password != "" {
		currentUser.PasswordHash = hashPassword(user.Password)
	}
	currentUser.IsAdmin = user.IsAdmin

	return clients.UpdateUser(currentUser)
}

// DeleteUser elimina un usuario
func DeleteUser(id int) error {
	return clients.DeleteUser(id)
}
