package controllers

import (
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/domain"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

var usuarios []domain.Usuario // Simula una "base de datos" temporal
var userService *services.UserService

func RegisterUser(u domain.Usuario) domain.Usuario {
	// Hashear contraseña
	hash := sha256.New()
	hash.Write([]byte(u.Contraseña))
	u.Contraseña = hex.EncodeToString(hash.Sum(nil))

	// Asignar ID simulado
	u.ID_usuario = len(usuarios) + 1

	// Guardar en lista
	usuarios = append(usuarios, u)

	return u
}

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

/*
descomentar cuando se implemente en services
func GetAllActivities(ctx *gin.Context) {
    activities, err := services.GetAllActivities()
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, activities)
}
*/
