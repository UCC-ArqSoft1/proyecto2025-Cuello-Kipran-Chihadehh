package controllers

import (
	"backend/domain"
	"backend/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

// LoginRequest estructura para la petición de login
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

// GetUserByID obtiene un usuario por ID
func GetUserByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		log.WithError(err).WithField("id_param", idParam).Error("Invalid user ID")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid user ID",
			"success": false,
		})
		return
	}

	user, err := services.GetUserByID(id)
	if err != nil {
		log.WithError(err).WithField("user_id", id).Error("User not found")
		c.JSON(http.StatusNotFound, gin.H{
			"error":   "User not found",
			"success": false,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user":    user,
		"success": true,
	})
}

// GetAllUsers obtiene todos los usuarios (solo para admins)
func GetAllUsers(c *gin.Context) {
	users, err := services.GetAllUsers()
	if err != nil {
		log.WithError(err).Error("Failed to get users")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve users",
			"success": false,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users":   users,
		"count":   len(users),
		"success": true,
	})
}

// UpdateUser actualiza un usuario existente
func UpdateUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		log.WithError(err).WithField("id_param", idParam).Error("Invalid user ID")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid user ID",
			"success": false,
		})
		return
	}

	var user domain.User
	if err := c.ShouldBindJSON(&user); err != nil {
		log.WithError(err).Error("Invalid update request")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request format",
			"success": false,
		})
		return
	}

	user.ID = id // Asegurar que el ID coincida

	if err := services.UpdateUser(user); err != nil {
		log.WithError(err).WithField("user_id", id).Error("Failed to update user")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"success": false,
		})
		return
	}

	log.WithField("user_id", id).Info("User updated successfully")
	c.JSON(http.StatusOK, gin.H{
		"message": "User updated successfully",
		"success": true,
	})
}

// DeleteUser elimina un usuario
func DeleteUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		log.WithError(err).WithField("id_param", idParam).Error("Invalid user ID")
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid user ID",
			"success": false,
		})
		return
	}

	if err := services.DeleteUser(id); err != nil {
		log.WithError(err).WithField("user_id", id).Error("Failed to delete user")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to delete user",
			"success": false,
		})
		return
	}

	log.WithField("user_id", id).Info("User deleted successfully")
	c.JSON(http.StatusOK, gin.H{
		"message": "User deleted successfully",
		"success": true,
	})
}
