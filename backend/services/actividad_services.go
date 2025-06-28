package services

import (
	"backend/clients"
	"backend/dao"
	"backend/domain"
	"errors"
	"fmt"
	"strconv"
)

// GetActivityByID obtiene una actividad por ID y la convierte al formato domain
func GetActivityByID(id int) (domain.Activity, error) {
	activityDao, err := clients.GetActivityByID(id)
	if err != nil {
		return domain.Activity{}, fmt.Errorf("activity not found with id %d: %w", id, err)
	}

	return domain.Activity{
		ID:          activityDao.ID_actividad,
		Name:        activityDao.Nombre,
		Profesor:    activityDao.Profesor,
		Categoria:   activityDao.Categoria,
		Cupos:       activityDao.Cupos,
		Description: activityDao.Descripcion,
		Dia:         activityDao.Dia,
		HoraInicio:  activityDao.Hora_inicio,
		HoraFin:     activityDao.Hora_fin,
	}, nil
}

// GetActivities obtiene todas las actividades
func GetActivities() ([]domain.Activity, error) {
	activitiesDao, err := clients.GetActivities()
	if err != nil {
		return nil, fmt.Errorf("failed to get activities: %w", err)
	}

	var activities []domain.Activity
	for _, activityDao := range activitiesDao {

		activities = append(activities, domain.Activity{
			ID:          activityDao.ID_actividad,
			Name:        activityDao.Nombre,
			Profesor:    activityDao.Profesor,
			Categoria:   activityDao.Categoria,
			Cupos:       activityDao.Cupos,
			Description: activityDao.Descripcion,
			Dia:         activityDao.Dia,
			HoraInicio:  activityDao.Hora_inicio,
			HoraFin:     activityDao.Hora_fin,
		})
	}

	return activities, nil
}

// InsertActivity crea una nueva actividad
func InsertActivity(activity domain.Activity) (domain.Activity, error) {
	// Validaciones básicas
	if activity.Name == "" {
		return domain.Activity{}, errors.New("activity name cannot be empty")
	}
	if activity.Profesor == "" {
		return domain.Activity{}, errors.New("profesor cannot be empty")
	}
	if activity.Categoria == "" {
		return domain.Activity{}, errors.New("categoria cannot be empty")
	}
	if activity.Description == "" {
		return domain.Activity{}, errors.New("description cannot be empty")
	}
	if activity.Dia <= 0 && activity.Dia > 7 {
		return domain.Activity{}, errors.New("dia cannot be empty or less than 1")
	}
	if activity.Cupos <= 0 {
		return domain.Activity{}, errors.New("cupos must be greater than 0")
	}
	if activity.HoraInicio == "" || activity.HoraFin == "" {
		return domain.Activity{}, errors.New("hora_inicio and hora_fin are required")
	}

	// Convertir domain.Activity a dao.Activity
	activityDao := dao.Activity{
		Nombre:      activity.Name,
		Profesor:    activity.Profesor,
		Cupos:       activity.Cupos,
		Categoria:   activity.Categoria,
		Descripcion: activity.Description,
		Dia:         activity.Dia,
		Hora_inicio: activity.HoraInicio,
		Hora_fin:    activity.HoraFin,
	}

	// Guardar en la base de datos
	createdActivity, err := clients.InsertActivity(activityDao)
	if err != nil {
		return domain.Activity{}, fmt.Errorf("failed to create activity: %w", err)
	}

	// Convertir de vuelta a domain.Activity

	return domain.Activity{
		ID:          createdActivity.ID_actividad,
		Name:        createdActivity.Nombre,
		Profesor:    createdActivity.Profesor,
		Categoria:   createdActivity.Categoria,
		Cupos:       createdActivity.Cupos,
		Description: createdActivity.Descripcion,
		Dia:         createdActivity.Dia,
		HoraInicio:  createdActivity.Hora_inicio,
		HoraFin:     createdActivity.Hora_fin,
	}, nil
}

// GetActivitiesByCategory obtiene actividades por categoría
func GetActivitiesByCategory(categoria string) ([]domain.Activity, error) {
	activitiesDao, err := clients.GetActivitiesByCategory(categoria)
	if err != nil {
		return nil, fmt.Errorf("failed to get activities by category: %w", err)
	}

	var activities []domain.Activity
	for _, activityDao := range activitiesDao {

		activities = append(activities, domain.Activity{
			ID:          activityDao.ID_actividad,
			Name:        activityDao.Nombre,
			Profesor:    activityDao.Profesor,
			Categoria:   activityDao.Categoria,
			Cupos:       activityDao.Cupos,
			Description: activityDao.Descripcion,
			Dia:         activityDao.Dia,
			HoraInicio:  activityDao.Hora_inicio,
			HoraFin:     activityDao.Hora_fin,
		})
	}

	return activities, nil
}

// GetActivitiesByProfesor obtiene actividades por profesor
func GetActivitiesByProfesor(profesor string) ([]domain.Activity, error) {
	activitiesDao, err := clients.GetActivitiesByProfesor(profesor)
	if err != nil {
		return nil, fmt.Errorf("failed to get activities by profesor: %w", err)
	}

	var activities []domain.Activity
	for _, activityDao := range activitiesDao {

		activities = append(activities, domain.Activity{
			ID:          activityDao.ID_actividad,
			Name:        activityDao.Nombre,
			Profesor:    activityDao.Profesor,
			Categoria:   activityDao.Categoria,
			Cupos:       activityDao.Cupos,
			Description: activityDao.Descripcion,
			Dia:         activityDao.Dia,
			HoraInicio:  activityDao.Hora_inicio,
			HoraFin:     activityDao.Hora_fin,
		})
	}

	return activities, nil
}

// GetActivitiesByDay obtiene actividades por día
func GetActivitiesByDay(dia int) ([]domain.Activity, error) {
	activitiesDao, err := clients.GetActivitiesByDay(strconv.Itoa(dia))
	if err != nil {
		return nil, fmt.Errorf("failed to get activities by day: %w", err)
	}

	var activities []domain.Activity
	for _, activityDao := range activitiesDao {

		activities = append(activities, domain.Activity{
			ID:          activityDao.ID_actividad,
			Name:        activityDao.Nombre,
			Profesor:    activityDao.Profesor,
			Categoria:   activityDao.Categoria,
			Cupos:       activityDao.Cupos,
			Description: activityDao.Descripcion,
			Dia:         activityDao.Dia,
			HoraInicio:  activityDao.Hora_inicio,
			HoraFin:     activityDao.Hora_fin,
		})
	}

	return activities, nil
}

// UpdateActivity actualiza una actividad existente
func UpdateActivity(activity domain.Activity) error {
	// Obtener la actividad actual
	currentActivity, err := clients.GetActivityByID(activity.ID)
	if err != nil {
		return fmt.Errorf("activity not found: %w", err)
	}

	// Actualizar los campos
	if activity.Name != "" {
		currentActivity.Nombre = activity.Name
	}
	if activity.Profesor != "" {
		currentActivity.Profesor = activity.Profesor
	}
	if activity.Categoria != "" {
		currentActivity.Categoria = activity.Categoria
	}
	if activity.Cupos > 0 {
		currentActivity.Cupos = activity.Cupos
	}
	if activity.Description != "" {
		currentActivity.Descripcion = activity.Description
	}
	if activity.Dia > 0 {
		currentActivity.Dia = activity.Dia
	}
	if activity.HoraInicio != "" {
		currentActivity.Hora_inicio = activity.HoraInicio
	}
	if activity.HoraFin != "" {
		currentActivity.Hora_fin = activity.HoraFin
	}

	return clients.UpdateActivity(currentActivity)
}

// DeleteActivity elimina una actividad
func DeleteActivity(id int) error {
	return clients.DeleteActivity(id)
}

// GetActivitiesWithAvailableSlots obtiene actividades con cupos disponibles
func GetActivitiesWithAvailableSlots() ([]domain.Activity, error) {
	activitiesDao, err := clients.GetActivitiesWithAvailableSlots()
	if err != nil {
		return nil, fmt.Errorf("failed to get activities with available slots: %w", err)
	}

	var activities []domain.Activity
	for _, activityDao := range activitiesDao {

		activities = append(activities, domain.Activity{
			ID:          activityDao.ID_actividad,
			Name:        activityDao.Nombre,
			Profesor:    activityDao.Profesor,
			Categoria:   activityDao.Categoria,
			Cupos:       activityDao.Cupos,
			Description: activityDao.Descripcion,
			Dia:         activityDao.Dia,
			HoraInicio:  activityDao.Hora_inicio,
			HoraFin:     activityDao.Hora_fin,
		})
	}

	return activities, nil
}

// UpdateActivitySlots actualiza los cupos de una actividad
func UpdateActivitySlots(id int, newSlots int) error {
	if newSlots < 0 {
		return errors.New("slots cannot be negative")
	}
	return clients.UpdateActivitySlots(id, newSlots)
}

// SearchActivitiesByName busca actividades por nombre
func SearchActivitiesByName(name string) ([]domain.Activity, error) {
	activitiesDao, err := clients.SearchActivitiesByName(name)
	if err != nil {
		return nil, fmt.Errorf("failed to search activities by name: %w", err)
	}

	var activities []domain.Activity
	for _, activityDao := range activitiesDao {

		activities = append(activities, domain.Activity{
			ID:          activityDao.ID_actividad,
			Name:        activityDao.Nombre,
			Profesor:    activityDao.Profesor,
			Categoria:   activityDao.Categoria,
			Cupos:       activityDao.Cupos,
			Description: activityDao.Descripcion,
			Dia:         activityDao.Dia,
			HoraInicio:  activityDao.Hora_inicio,
			HoraFin:     activityDao.Hora_fin,
		})
	}

	return activities, nil
}
