package controllers

import (
	"backend/domain"
	"backend/services"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetInscriptionByID maneja la obtención de una inscripción por ID
func GetInscriptionByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	inscription, err := services.GetInscriptionByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Inscription not found"})
		return
	}

	// Convertir a response
	response := domain.InscripcionResponse{
		Id:          inscription.Id,
		UsuarioId:   inscription.UsuarioId,
		ActividadId: inscription.ActividadId,
		Usuario: domain.UserResponse{
			ID:       inscription.Usuario.ID,
			Username: inscription.Usuario.Username,
			IsAdmin:  inscription.Usuario.IsAdmin,
		},
		Actividad: domain.ActivityResponse{
			ID:          inscription.Actividad.ID,
			Name:        inscription.Actividad.Name,
			Profesor:    inscription.Actividad.Profesor,
			Categoria:   inscription.Actividad.Categoria,
			Cupos:       inscription.Actividad.Cupos,
			Description: inscription.Actividad.Description,
			Dia:         inscription.Actividad.Dia,
			HoraInicio:  inscription.Actividad.HoraInicio,
			HoraFin:     inscription.Actividad.HoraFin,
		},
	}

	c.JSON(http.StatusOK, response)
}
func GetInscriptionByUserAndActivity(c *gin.Context) {
	usuarioId, err := strconv.Atoi(c.Param("usuario_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	actividadId, err := strconv.Atoi(c.Param("actividad_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid activity ID format"})
		return
	}

	inscription, err := services.GetInscriptionByUserAndActivity(usuarioId, actividadId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Inscription not found"})
		return
	}

	// Convertir a response
	response := domain.InscripcionResponse{
		Id:          inscription.Id,
		UsuarioId:   inscription.UsuarioId,
		ActividadId: inscription.ActividadId,
		Usuario: domain.UserResponse{
			ID:       inscription.Usuario.ID,
			Username: inscription.Usuario.Username,
			IsAdmin:  inscription.Usuario.IsAdmin,
		},
		Actividad: domain.ActivityResponse{
			ID:          inscription.Actividad.ID,
			Name:        inscription.Actividad.Name,
			Profesor:    inscription.Actividad.Profesor,
			Categoria:   inscription.Actividad.Categoria,
			Cupos:       inscription.Actividad.Cupos,
			Description: inscription.Actividad.Description,
			Dia:         inscription.Actividad.Dia,
			HoraInicio:  inscription.Actividad.HoraInicio,
			HoraFin:     inscription.Actividad.HoraFin,
		},
	}

	c.JSON(http.StatusOK, response)
}

// CreateInscription maneja la creación de una nueva inscripción
func CreateInscription(c *gin.Context) {
	var request domain.InscripcionRequest

	// Validar y bindear el JSON del request
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request data",
			"details": err.Error(),
		})
		return
	}

	fmt.Printf("usuarioid: %v ", request.UsuarioId)
	fmt.Printf("actividadoid: %v ", request.ActividadId)

	/*
		// Validar que los IDs sean válidos
		if request.UsuarioId <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid usuario_id"})
			return
		}

		if request.ActividadId <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid actividad_id"})
			return
		}
	*/
	// Convertir InscripcionRequest a domain.Inscripcion
	inscripcion := domain.Inscripcion{
		UsuarioId:   request.UsuarioId,
		ActividadId: request.ActividadId,
	}

	// Llamar al service para crear la inscripción
	newInscription, err := services.CreateInscription(inscripcion)
	if err != nil {
		// Manejar diferentes tipos de errores
		if err.Error() == "user already inscribed in this activity" {
			c.JSON(http.StatusConflict, gin.H{"error": "User is already inscribed in this activity"})
			return
		}
		if err.Error() == "activity has no available slots" {
			c.JSON(http.StatusConflict, gin.H{"error": "Activity has no available slots"})
			return
		}
		if err.Error() == "user not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		if err.Error() == "activity not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Activity not found"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create inscription",
			"details": err.Error(),
		})
		return
	}

	// Convertir a response
	response := domain.InscripcionResponse{
		Id:          newInscription.Id,
		UsuarioId:   newInscription.UsuarioId,
		ActividadId: newInscription.ActividadId,
		Usuario: domain.UserResponse{
			ID:       newInscription.Usuario.ID,
			Username: newInscription.Usuario.Username,
			IsAdmin:  newInscription.Usuario.IsAdmin,
		},
		Actividad: domain.ActivityResponse{
			ID:          newInscription.Actividad.ID,
			Name:        newInscription.Actividad.Name,
			Profesor:    newInscription.Actividad.Profesor,
			Categoria:   newInscription.Actividad.Categoria,
			Cupos:       newInscription.Actividad.Cupos,
			Description: newInscription.Actividad.Description,
			Dia:         newInscription.Actividad.Dia,
			HoraInicio:  newInscription.Actividad.HoraInicio,
			HoraFin:     newInscription.Actividad.HoraFin,
		},
	}

	c.JSON(http.StatusCreated, response)
}
func GetInscriptionsByUserID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// Este método requerirá que implementes GetInscriptionsByUserID en el service
	// Por ahora solo devuelvo un mensaje indicando que no está implementado
	c.JSON(http.StatusNotImplemented, gin.H{
		"message": "GetInscriptionsByUserID service method not implemented yet",
		"user_id": id,
	})
}
func GetActivitiesByUser(c *gin.Context) {
	userId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	// Opcional: Verificar que el usuario autenticado tiene permisos para ver estas actividades
	// (por ejemplo, solo puede ver sus propias actividades o es admin)
	authenticatedUserID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Convertir authenticatedUserID a int para comparar
	var authID int
	switch v := authenticatedUserID.(type) {
	case int:
		authID = v
	case float64:
		authID = int(v)
	case string:
		authID, err = strconv.Atoi(v)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid authenticated user ID format"})
			return
		}
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid authenticated user ID type"})
		return
	}

	// Verificar que el usuario solo puede ver sus propias actividades (o implementar lógica de admin)
	if authID != userId {
		// Aquí podrías verificar si el usuario es admin
		// Por ahora, no permitimos que vean actividades de otros usuarios
		c.JSON(http.StatusForbidden, gin.H{"error": "Cannot access other user's activities"})
		return
	}

	// Obtener las inscripciones del usuario
	inscriptions, err := services.GetMyActivities(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to get user activities",
			"details": err.Error(),
		})
		return
	}

	// Convertir a response format
	var responses []domain.InscripcionResponse
	for _, inscription := range inscriptions {
		response := domain.InscripcionResponse{
			Id:          inscription.Id,
			UsuarioId:   inscription.UsuarioId,
			ActividadId: inscription.ActividadId,
			Usuario: domain.UserResponse{
				ID:       inscription.Usuario.ID,
				Username: inscription.Usuario.Username,
				IsAdmin:  inscription.Usuario.IsAdmin,
			},
			Actividad: domain.ActivityResponse{
				ID:          inscription.Actividad.ID,
				Name:        inscription.Actividad.Name,
				Profesor:    inscription.Actividad.Profesor,
				Categoria:   inscription.Actividad.Categoria,
				Cupos:       inscription.Actividad.Cupos,
				Description: inscription.Actividad.Description,
				Dia:         inscription.Actividad.Dia,
				HoraInicio:  inscription.Actividad.HoraInicio,
				HoraFin:     inscription.Actividad.HoraFin,
			},
		}
		responses = append(responses, response)
	}

	c.JSON(http.StatusOK, responses)
}

// GetInscriptions maneja la obtención de todas las inscripciones (opcional)
func GetInscriptions(c *gin.Context) {
	// Este método requerirá que implementes GetAllInscriptions en el service
	// Por ahora solo devuelvo un mensaje indicando que no está implementado
	c.JSON(http.StatusNotImplemented, gin.H{
		"message": "GetAllInscriptions service method not implemented yet",
	})
}

// DeleteInscription maneja la eliminación de una inscripción (opcional)
func DeleteInscription(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// Este método requerirá que implementes DeleteInscription en el service
	// Por ahora solo devuelvo un mensaje indicando que no está implementado
	c.JSON(http.StatusNotImplemented, gin.H{
		"message": "DeleteInscription service method not implemented yet",
		"id":      id,
	})
}
