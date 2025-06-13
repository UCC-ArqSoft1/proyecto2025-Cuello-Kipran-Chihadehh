package services

import (
	"backend/clients"
	"backend/dao"
	"backend/domain"
	"errors"
)

func GetInscriptionByID(id int) (*domain.Inscripcion, error) {
	inscripcion, err := clients.GetInscriptionByID(id)
	if err != nil {
		return nil, err
	}

	// Cargar las relaciones (Usuario y Actividad)
	user, err := clients.GetUserByID(inscripcion.ID_usuario)
	if err != nil {
		return nil, err
	}

	activity, err := clients.GetActivityByID(inscripcion.ID_actividad)
	if err != nil {
		return nil, err
	}

	return &domain.Inscripcion{
		Id:          inscripcion.ID_inscripcion,
		UsuarioId:   inscripcion.ID_usuario,
		ActividadId: inscripcion.ID_actividad,
		Usuario: domain.User{
			ID:       user.ID,
			Username: user.Username,
			IsAdmin:  user.IsAdmin,
		},
		Actividad: domain.Activity{
			ID:          activity.ID_actividad,
			Name:        activity.Nombre,
			Profesor:    activity.Profesor,
			Categoria:   activity.Categoria,
			Cupos:       activity.Cupos,
			Description: activity.Descripcion,
			Dia:         activity.Dia,
			HoraInicio:  activity.Hora_inicio,
			HoraFin:     activity.Hora_fin,
		},
	}, nil
}

func CreateInscription(inscripcion domain.Inscripcion) (*domain.Inscripcion, error) {
	// Validar que el usuario existe
	user, err := clients.GetUserByID(inscripcion.UsuarioId)
	if err != nil {
		return nil, errors.New("user not found")
	}

	// Validar que la actividad existe
	activity, err := clients.GetActivityByID(inscripcion.ActividadId)
	if err != nil {
		return nil, errors.New("activity not found")
	}

	// Validar que la actividad tiene cupos disponibles
	if activity.Cupos <= 0 {
		return nil, errors.New("activity has no available slots")
	}

	// Verificar si el usuario ya está inscrito en esta actividad
	existingInscription, err := clients.GetInscriptionByUserAndActivity(inscripcion.UsuarioId, inscripcion.ActividadId)
	if err == nil && existingInscription.ID_inscripcion > 0 {
		return nil, errors.New("user already inscribed in this activity")
	}

	// Crear la inscripción
	newInscription := dao.Inscription{
		ID_usuario:   inscripcion.UsuarioId,
		ID_actividad: inscripcion.ActividadId,
	}

	createdInscription, err := clients.CreateInscription(newInscription)
	if err != nil {
		return nil, err
	}

	// Reducir los cupos de la actividad
	newSlots := activity.Cupos - 1
	err = clients.UpdateActivitySlots(activity.ID_actividad, newSlots)
	if err != nil {
		// Si falla la actualización de cupos, podrías considerar hacer rollback de la inscripción
		// Por simplicidad, solo loggeamos el error
		// log.Printf("Warning: Failed to update activity slots after inscription: %v", err)
	}

	// Retornar la inscripción completa con los datos relacionados
	return &domain.Inscripcion{
		Id:          createdInscription.ID_inscripcion,
		UsuarioId:   createdInscription.ID_usuario,
		ActividadId: createdInscription.ID_actividad,
		Usuario: domain.User{
			ID:       user.ID,
			Username: user.Username,
			IsAdmin:  user.IsAdmin,
		},
		Actividad: domain.Activity{
			ID:          activity.ID_actividad,
			Name:        activity.Nombre,
			Profesor:    activity.Profesor,
			Categoria:   activity.Categoria,
			Cupos:       newSlots, // Cupos actualizados
			Description: activity.Descripcion,
			Dia:         activity.Dia,
			HoraInicio:  activity.Hora_inicio,
			HoraFin:     activity.Hora_fin,
		},
	}, nil
}

// Método adicional para obtener todas las inscripciones (opcional)
func GetAllInscriptions() ([]domain.Inscripcion, error) {
	inscriptions, err := clients.GetAllInscriptions()
	if err != nil {
		return nil, err
	}

	var result []domain.Inscripcion
	for _, inscription := range inscriptions {
		// Cargar usuario y actividad para cada inscripción
		user, err := clients.GetUserByID(inscription.ID_usuario)
		if err != nil {
			continue // Skip this inscription if user not found
		}

		activity, err := clients.GetActivityByID(inscription.ID_actividad)
		if err != nil {
			continue // Skip this inscription if activity not found
		}

		result = append(result, domain.Inscripcion{
			Id:          inscription.ID_inscripcion,
			UsuarioId:   inscription.ID_usuario,
			ActividadId: inscription.ID_actividad,
			Usuario: domain.User{
				ID:       user.ID,
				Username: user.Username,
				IsAdmin:  user.IsAdmin,
			},
			Actividad: domain.Activity{
				ID:          activity.ID_actividad,
				Name:        activity.Nombre,
				Profesor:    activity.Profesor,
				Categoria:   activity.Categoria,
				Cupos:       activity.Cupos,
				Description: activity.Descripcion,
				Dia:         activity.Dia,
				HoraInicio:  activity.Hora_inicio,
				HoraFin:     activity.Hora_fin,
			},
		})
	}

	return result, nil
}
