package controllers

import (
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/domain"

	"github.com/gin-gonic/gin"
)

type UserService interface {
	Login(username string, password string) (int, string, error)
}

type UserController struct {
	UserService UserService
}

func NewUserController(userService UserService) *UserController {
	return &UserController{
		UserService: userService,
	}
}

func (c *UserController) Login(ctx *gin.Context) {
	var request domain.LoginRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, token, err := c.UserService.Login(request.Username, request.Password)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, domain.LoginResponse{
		UserID: userID,
		Token:  token,
	})
}

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
