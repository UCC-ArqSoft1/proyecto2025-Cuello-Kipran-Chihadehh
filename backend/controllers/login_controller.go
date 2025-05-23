package controllers

import (
	"backend/domain"
	"backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse estructura para la respuesta de login
type LoginResponse struct {
	Message string      `json:"message"`
	User    domain.User `json:"user,omitempty"`
	Success bool        `json:"success"`
}

// Login maneja el login de usuarios
func Login(c *gin.Context) {
	var loginReq LoginRequest

	if err := c.ShouldBindJSON(&loginReq); err != nil {
		log.WithError(err).Error("Invalid login request")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request format",
			"success": false,
		})
		return
	}

	// Validar credenciales
	user, err := services.ValidateUserCredentials(loginReq.Username, loginReq.Password)
	if err != nil {
		log.WithError(err).WithField("username", loginReq.Username).Warn("Login failed")
		c.JSON(http.StatusUnauthorized, LoginResponse{
			Message: "Invalid credentials",
			Success: false,
		})
		return
	}

	log.WithField("user_id", user.ID).Info("User logged in successfully")
	c.JSON(http.StatusOK, LoginResponse{
		Message: "Login successful",
		User:    user,
		Success: true,
	})
}

// Register maneja el registro de nuevos usuarios
func Register(c *gin.Context) {
	var user domain.User

	if err := c.ShouldBindJSON(&user); err != nil {
		log.WithError(err).Error("Invalid register request")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request format",
			"success": false,
		})
		return
	}

	// Crear usuario
	createdUser, err := services.CreateUser(user)
	if err != nil {
		log.WithError(err).WithField("username", user.Username).Error("Failed to create user")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"success": false,
		})
		return
	}

	log.WithField("user_id", createdUser.ID).Info("User registered successfully")
	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"user":    createdUser,
		"success": true,
	})
}
