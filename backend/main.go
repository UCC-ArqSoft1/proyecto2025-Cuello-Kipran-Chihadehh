package main

import (
	"backend/clients"
	"backend/controllers"
	"backend/utils"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// ========================================
	// 1. INICIALIZAR BASE DE DATOS PRIMERO
	// ========================================
	log.Println("Initializing database connection...")
	mysqlClient := clients.NewMysqlClient()
	if mysqlClient == nil {
		panic("Failed to initialize MySQL client")
	}
	log.Println("Database connection established and migrations completed")

	// ========================================
	// 2. CONFIGURAR EL ROUTER
	// ========================================
	router := gin.Default()

	// Set up CORS middleware directamente aquí, para permitir tu frontend React
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Cambia si frontend corre en otro origen
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// ========================================
	// 3. CONFIGURAR RUTAS
	// ========================================

	// Authentication routes
	router.POST("/login", controllers.Login)
	router.POST("/register", controllers.Register)

	// User routes
	router.GET("/users", controllers.GetAllUsers)
	router.GET("/users/:id", controllers.GetUserByID)
	router.PUT("/users/:id", utils.JwtAuthMiddleware(), controllers.UpdateUser)
	router.DELETE("/users/:id", utils.JwtAuthMiddleware(), controllers.DeleteUser)

	// Activity routes
	router.GET("/activities", controllers.GetActivities)
	router.GET("/activities/:id", controllers.GetActivityByID)
	// Rutas de actividades que requieren rol de administrador
	router.POST("/activities", utils.JwtAuthMiddleware(), utils.AdminAuthMiddleware(), controllers.CreateActivity)
	router.PUT("/activities/:id", utils.JwtAuthMiddleware(), utils.AdminAuthMiddleware(), controllers.UpdateActivity)
	router.DELETE("/activities/:id", utils.JwtAuthMiddleware(), utils.AdminAuthMiddleware(), controllers.DeleteActivity)

	// Activity filters and search
	router.GET("/activities/category/:categoria", controllers.GetActivitiesByCategory)
	router.GET("/activities/profesor/:profesor", controllers.GetActivitiesByProfesor)
	router.GET("/activities/day/:dia", controllers.GetActivitiesByDay)
	router.GET("/activities/available", controllers.GetActivitiesWithAvailableSlots)
	router.GET("/activities/search", controllers.SearchActivitiesByName)
	router.PUT("/activities/:id/slots", utils.JwtAuthMiddleware(), utils.AdminAuthMiddleware(), controllers.UpdateActivitySlots) // También requiere admin para actualizar cupos

	//Inscriptions routes
	router.GET("/inscription/:id", controllers.GetInscriptionByID)
	router.POST("/inscription", controllers.CreateInscription)
	router.GET("/inscriptions/myactivities/:id", utils.JwtAuthMiddleware(), controllers.GetActivitiesByUser)
	router.DELETE("/inscriptions/:id", utils.JwtAuthMiddleware(), controllers.DeleteInscription)

	// ========================================
	// 4. INICIAR SERVIDOR
	// ========================================
	log.Println("Starting server on port 8080...")
	if err := router.Run(":8080"); err != nil {
		panic("Failed to start server: " + err.Error())
	}
}
