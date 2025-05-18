package services

import (
	"fmt"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/dao"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/domain"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/utils"
)

type UserClient interface {
	GetUserByUsername(username string) (dao.User, error)
	GetUserByID(userID int) (dao.User, error)
	CreateUser(user dao.User) (dao.User, error)
	GetAllActivities() ([]dao.Activity, error)
	GetActivityByID(activityID int) (dao.Activity, error)
	SearchActivities(query string) ([]dao.Activity, error)
	CreateActivity(activity dao.Activity) (dao.Activity, error)
	UpdateActivity(activityID int, updatedActivity dao.Activity) (dao.Activity, error)
	DeleteActivity(activityID int) error
	GetAllCategories() ([]dao.Category, error)
	CreateCategory(category dao.Category) (dao.Category, error)
	GetAllTimeSlots() ([]dao.TimeSlot, error)
	CreateTimeSlot(timeSlot dao.TimeSlot) (dao.TimeSlot, error)
}

type UserService struct {
	UserClient UserClient
}

func NewUserService(userClient UserClient) *UserService {
	return &UserService{
		UserClient: userClient,
	}
}

func (s *UserService) Login(username string, password string) (int, string, error) {
	userDAO, err := s.UserClient.GetUserByUsername(username)
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

func (s *UserService) GetActivityByID(activityID int) (domain.ActDeportiva, error) {
	// Simulación de una actividad
	return domain.ActDeportiva{
		ID_actividad: activityID,
		Nombre:       "Yoga",
		Profesor:     "ismael",
		Id_usuario:   1,
		Cupos:        20,
		Id_categoria: 1,
		Fecha:        "2023-10-01",
		Hora_inicio:  "10:00",
		Duracion:     "60",
		Descripcion:  "Clase de yoga para principiantes",
	}, nil
} /* // Uncomment this code when the UserClient is implemented

activity, err := s.UserClient.GetUserByUsername(activityID)
if err != nil {
	return dao.Activity{}, fmt.Errorf("error getting activity: %w", err)
}
return activity, nil
*/
