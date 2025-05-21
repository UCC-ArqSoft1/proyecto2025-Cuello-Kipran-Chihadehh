package controllers

import (
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/dao"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/domain"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/services"

	"github.com/gin-gonic/gin"
)

func CreateUser(ctx *gin.Context) {
	var user dao.User
	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash the password
	hash := sha256.New()
	hash.Write([]byte(user.PasswordHash))
	user.PasswordHash = hex.EncodeToString(hash.Sum(nil))

	userService := services.UserService{}
	createdUser, err := userService.CreateUser(user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, createdUser)
}
func Login(ctx *gin.Context) {
	var request domain.LoginRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userService := services.UserService{}
	userID, token, err, IsAdmin := userService.Login(request.Username, request.Password)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Login exitoso",
		"usuario": userID,
		"token":   token, // en el paso 3 lo agregamos
		"isAdmin": IsAdmin,
	})
}

func GetUserByUsername(ctx *gin.Context) {
	username := ctx.Param("username")
	userService := services.UserService{}
	user, err := userService.GetUserByUsername(username)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, user)
}
