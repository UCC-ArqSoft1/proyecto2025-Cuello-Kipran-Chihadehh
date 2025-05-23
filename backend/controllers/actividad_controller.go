package controllers

import (
	"backend/domain"
	"backend/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

// GetActivityByID obtiene una actividad por ID
func GetActivityByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		log.WithError(err).WithField("id_param", idParam).Error("Invalid activity ID")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid activity ID",
			"success": false,
		})
		return
	}

	activity, err := services.GetActivityByID(id)
	if err != nil {
		log.WithError(err).WithField("activity_id", id).Error("Activity not found")
		c.JSON(http.StatusNotFound, gin.H{
			"error":   "Activity not found",
			"success": false,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"activity": activity,
		"success":  true,
	})
}

// GetActivities obtiene todas las actividades
func GetActivities(c *gin.Context) {
	activities, err := services.GetActivities()
	if err != nil {
		log.WithError(err).Error("Failed to get activities")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve activities",
			"success": false,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"activities": activities,
		"count":      len(activities),
		"success":    true,
	})
}

// CreateActivity crea una nueva actividad
func CreateActivity(c *gin.Context) {
	var activity domain.Activity

	if err := c.ShouldBindJSON(&activity); err != nil {
		log.WithError(err).Error("Invalid create activity request")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request format",
			"success": false,
		})
		return
	}

	createdActivity, err := services.InsertActivity(activity)
	if err != nil {
		log.WithError(err).WithField("activity_name", activity.Name).Error("Failed to create activity")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"success": false,
		})
		return
	}

	log.WithField("activity_id", createdActivity.ID).Info("Activity created successfully")
	c.JSON(http.StatusCreated, gin.H{
		"message":  "Activity created successfully",
		"activity": createdActivity,
		"success":  true,
	})
}

// UpdateActivity actualiza una actividad existente
func UpdateActivity(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		log.WithError(err).WithField("id_param", idParam).Error("Invalid activity ID")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid activity ID",
			"success": false,
		})
		return
	}

	var activity domain.Activity
	if err := c.ShouldBindJSON(&activity); err != nil {
		log.WithError(err).Error("Invalid update request")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request format",
			"success": false,
		})
		return
	}

	activity.ID = id // Asegurar que el ID coincida

	if err := services.UpdateActivity(activity); err != nil {
		log.WithError(err).WithField("activity_id", id).Error("Failed to update activity")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"success": false,
		})
		return
	}

	log.WithField("activity_id", id).Info("Activity updated successfully")
	c.JSON(http.StatusOK, gin.H{
		"message": "Activity updated successfully",
		"success": true,
	})
}

// DeleteActivity elimina una actividad
func DeleteActivity(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		log.WithError(err).WithField("id_param", idParam).Error("Invalid activity ID")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid activity ID",
			"success": false,
		})
		return
	}

	if err := services.DeleteActivity(id); err != nil {
		log.WithError(err).WithField("activity_id", id).Error("Failed to delete activity")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to delete activity",
			"success": false,
		})
		return
	}

	log.WithField("activity_id", id).Info("Activity deleted successfully")
	c.JSON(http.StatusOK, gin.H{
		"message": "Activity deleted successfully",
		"success": true,
	})
}

// GetActivitiesByCategory obtiene actividades por categoría
func GetActivitiesByCategory(c *gin.Context) {
	categoria := c.Param("categoria")
	if categoria == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Category is required",
			"success": false,
		})
		return
	}

	activities, err := services.GetActivitiesByCategory(categoria)
	if err != nil {
		log.WithError(err).WithField("categoria", categoria).Error("Failed to get activities by category")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve activities",
			"success": false,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"activities": activities,
		"categoria":  categoria,
		"count":      len(activities),
		"success":    true,
	})
}

// GetActivitiesByProfesor obtiene actividades por profesor
func GetActivitiesByProfesor(c *gin.Context) {
	profesor := c.Param("profesor")
	if profesor == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Profesor is required",
			"success": false,
		})
		return
	}

	activities, err := services.GetActivitiesByProfesor(profesor)
	if err != nil {
		log.WithError(err).WithField("profesor", profesor).Error("Failed to get activities by profesor")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve activities",
			"success": false,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"activities": activities,
		"profesor":   profesor,
		"count":      len(activities),
		"success":    true,
	})
}

// GetActivitiesByDay obtiene actividades por día
func GetActivitiesByDay(c *gin.Context) {
	diaParam := c.Param("dia")
	dia, err := strconv.Atoi(diaParam)
	if err != nil {
		log.WithError(err).WithField("dia_param", diaParam).Error("Invalid day")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid day",
			"success": false,
		})
		return
	}

	activities, err := services.GetActivitiesByDay(dia)
	if err != nil {
		log.WithError(err).WithField("dia", dia).Error("Failed to get activities by day")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve activities",
			"success": false,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"activities": activities,
		"dia":        dia,
		"count":      len(activities),
		"success":    true,
	})
}

// GetActivitiesWithAvailableSlots obtiene actividades con cupos disponibles
func GetActivitiesWithAvailableSlots(c *gin.Context) {
	activities, err := services.GetActivitiesWithAvailableSlots()
	if err != nil {
		log.WithError(err).Error("Failed to get activities with available slots")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve activities",
			"success": false,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"activities": activities,
		"count":      len(activities),
		"success":    true,
	})
}

// SearchActivitiesByName busca actividades por nombre
func SearchActivitiesByName(c *gin.Context) {
	name := c.Query("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Name parameter is required",
			"success": false,
		})
		return
	}

	activities, err := services.SearchActivitiesByName(name)
	if err != nil {
		log.WithError(err).WithField("name", name).Error("Failed to search activities by name")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to search activities",
			"success": false,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"activities": activities,
		"search":     name,
		"count":      len(activities),
		"success":    true,
	})
}

// UpdateActivitySlots actualiza los cupos de una actividad
func UpdateActivitySlots(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		log.WithError(err).WithField("id_param", idParam).Error("Invalid activity ID")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid activity ID",
			"success": false,
		})
		return
	}

	var request struct {
		Cupos int `json:"cupos" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		log.WithError(err).Error("Invalid update slots request")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request format",
			"success": false,
		})
		return
	}

	if err := services.UpdateActivitySlots(id, request.Cupos); err != nil {
		log.WithError(err).WithField("activity_id", id).Error("Failed to update activity slots")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"success": false,
		})
		return
	}

	log.WithFields(log.Fields{
		"activity_id": id,
		"new_slots":   request.Cupos,
	}).Info("Activity slots updated successfully")

	c.JSON(http.StatusOK, gin.H{
		"message": "Activity slots updated successfully",
		"success": true,
	})
}
