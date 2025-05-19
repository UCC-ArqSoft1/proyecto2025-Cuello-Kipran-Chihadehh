package controllers

import (
	"net/http"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/dao"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/domain"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/services"
	"strconv"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

var usuarios []domain.Usuario // Simula una "base de datos" temporal
var userService *services.UserService

/*
	func Login(ctx *gin.Context) {
		var request domain.LoginRequest
		if err := ctx.ShouldBindJSON(&request); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userID, token, err := services.Login(request.Username, request.Password)
		if err != nil {
			ctx.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"user_id": userID,
			"token":   token,
		})
	}
*/
func GetActivityByID(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid activity ID"})
		return
	}

	activity, err := userService.GetActivityByID(id) // userService must be defined and initialized
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, activity)
}

func ActividadInsert(c *gin.Context) {
	var actividadDto dao.Activity
	err := c.BindJSON(&actividadDto)

	// Error Parsing json param
	if err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	actividadDto, er := userService.InsertActividad(actividadDto)
	// Error del Insert
	if er != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": er.Error()})
		return
	}

	c.JSON(http.StatusCreated, actividadDto)
}

/*
func GetAllActivities(ctx *gin.Context) {
    activities, err := services.GetAllActivities()
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, activities)
}
*/
