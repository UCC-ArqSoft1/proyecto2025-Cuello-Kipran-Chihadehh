package services

import (
	"fmt"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/dao"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/domain"

	"gorm.io/gorm"
)

var Db *gorm.DB

// Define the UserClient interface with the required methods
type UserClient interface {
	GetActivityByID(activityID int) (dao.Activity, error)
	InsertActividad(actividad domain.Activity) (dao.Activity, error)

	// Add other methods as needed
}

type UserService struct {
	UserClient UserClient
}

func NewUserService(userClient UserClient) *UserService {
	return &UserService{
		UserClient: userClient,
	}
}

func (s *UserService) GetActivityByID(activityID int) (dao.Activity, error) {

	activity, err := s.UserClient.GetActivityByID(activityID)
	if err != nil {
		return dao.Activity{}, fmt.Errorf("error getting activity: %w", err)
	}

	return activity, nil
}

func (s UserService) InsertActividad(actividadDto dao.Activity) (dao.Activity, error) {

	var actividad domain.Activity

	actividad.Nombre = actividadDto.Nombre
	actividad.Descripcion = actividadDto.Descripcion
	actividad.Cupos = actividadDto.Cupos
	actividad.Fecha = actividadDto.Fecha
	actividad.Hora_inicio = actividadDto.Hora_inicio
	actividad.Duracion = actividadDto.Duracion
	actividad.Profesor = actividadDto.Profesor
	actividad.Id_usuario = actividadDto.Id_usuario
	actividad.Id_categoria = actividadDto.Id_categoria

	insertedActividad, err := s.UserClient.InsertActividad(actividad)
	if err != nil {
		return dao.Activity{}, fmt.Errorf("error inserting actividad: %w", err)
	}

	actividadDto.ID_actividad = insertedActividad.ID_actividad

	return actividadDto, nil
}
