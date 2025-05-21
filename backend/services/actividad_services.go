package services

import (
	"fmt"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/dao"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/domain"

	"gorm.io/gorm"
)

var Db *gorm.DB

// Define the ActClient interface with the required methods
type ActClient interface {
	GetActivityByID(activityID int) (dao.Activity, error)
	InsertActividad(actividad domain.Activity) (dao.Activity, error)
	GetAllActivities() ([]dao.Activity, error)
	// Add other methods as needed
}

type ActService struct {
	ActClient ActClient
}

func NewActService(ActClient ActClient) *ActService {
	return &ActService{
		ActClient: ActClient,
	}
}

func (s *ActService) GetActivityByID(activityID int) (dao.Activity, error) {

	activity, err := s.ActClient.GetActivityByID(activityID)
	if err != nil {
		return dao.Activity{}, fmt.Errorf("error getting activity: %w", err)
	}

	return activity, nil
}
func (s *ActService) GetAllActivities() ([]dao.Activity, error) {
	activities, err := s.ActClient.GetAllActivities()
	if err != nil {
		return nil, fmt.Errorf("error getting all activities: %w", err)
	}

	return activities, nil
}

func (s ActService) InsertActividad(actividadDto dao.Activity) (dao.Activity, error) {

	var actividad domain.Activity

	actividad.Nombre = actividadDto.Nombre
	actividad.Descripcion = actividadDto.Descripcion
	actividad.Cupos = actividadDto.Cupos
	actividad.Fecha = actividadDto.Fecha
	actividad.Hora_inicio = actividadDto.Hora_inicio
	actividad.Duracion = actividadDto.Duracion
	actividad.Profesor = actividadDto.Profesor
	actividad.Categoria = actividadDto.Categoria

	insertedActividad, err := s.ActClient.InsertActividad(actividad)
	if err != nil {
		return dao.Activity{}, fmt.Errorf("error inserting actividad: %w", err)
	}

	actividadDto.ID_actividad = insertedActividad.ID_actividad

	return actividadDto, nil
}
