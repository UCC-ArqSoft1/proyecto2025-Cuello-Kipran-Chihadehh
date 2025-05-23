package main

import (
	"backend/controllers"
	"backend/services"
	"backend/utils"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize the Gin router
	router := gin.Default()
	// Set up CORS middleware
	router.Use(utils.CORS)
	// Set up routes
	router.POST("/login", controllers.Login)
	router.POST("/register", controllers.Register)
	router.GET("/activities", controllers.GetActivities)
	router.GET("/activities/:id", controllers.GetActivityByID)
	router.POST("/activities", controllers.CreateActivity)
	router.PUT("/activities/:id", controllers.UpdateActivity)
	router.DELETE("/activities/:id", controllers.DeleteActivity)
	router.GET("/activities/category/:categoria", controllers.GetActivitiesByCategory)
	router.GET("/activities/profesor/:profesor", controllers.GetActivitiesByProfesor)
	router.GET("/activities/day/:dia", controllers.GetActivitiesByDay)
	router.GET("/activities/available", controllers.GetActivitiesWithAvailableSlots)
	router.GET("/activities/search", controllers.SearchActivitiesByName)
	router.PUT("/activities/:id/slots", controllers.UpdateActivitySlots)
	router.GET("/users", controllers.GetAllUsers)
	router.GET("/users/:id", controllers.GetUserByID)
	router.PUT("/users/:id", controllers.UpdateUser)
	router.DELETE("/users/:id", controllers.DeleteUser)
	router.POST("/users/login", controllers.Login)
	router.POST("/users/register", controllers.Register)
	// Initialize the database connection
	if err := services.InitializeDB(); err != nil {
		panic("Failed to connect to the database: " + err.Error())
	}

	router.Run()
}
