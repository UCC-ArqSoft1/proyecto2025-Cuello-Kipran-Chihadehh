package app

import (
	"backend/controllers"
)

func mapUrls() {
	// ================ USER ROUTES ================

	// Autenticación
	router.POST("/users/login", controllers.Login)
	router.POST("/users/register", controllers.Register)

	// CRUD de usuarios
	router.GET("/users/:id", controllers.GetUserByID)
	router.GET("/users", controllers.GetAllUsers)
	router.PUT("/users/:id", controllers.UpdateUser)
	router.DELETE("/users/:id", controllers.DeleteUser)

	// ================ ACTIVITY ROUTES ================

	// CRUD de actividades
	router.GET("/activities/:id", controllers.GetActivityByID)
	router.GET("/activities", controllers.GetActivities)
	router.POST("/activities", controllers.CreateActivity)
	router.PUT("/activities/:id", controllers.UpdateActivity)
	router.DELETE("/activities/:id", controllers.DeleteActivity)

	// Filtros y búsquedas de actividades
	router.GET("/activities/category/:categoria", controllers.GetActivitiesByCategory)
	router.GET("/activities/profesor/:profesor", controllers.GetActivitiesByProfesor)
	router.GET("/activities/day/:dia", controllers.GetActivitiesByDay)
	router.GET("/activities/available", controllers.GetActivitiesWithAvailableSlots)
	router.GET("/activities/search", controllers.SearchActivitiesByName)

	// Actualización de cupos
	router.PUT("/activities/:id/slots", controllers.UpdateActivitySlots)
	// ================ ENROLLMENT ROUTES ================
	router.POST("/enrollments", controllers.CreateInscription)                    // Ya existe en main.go como /inscription
	router.GET("/enrollments/user/:user_id", controllers.GetInscriptionsByUserID) // Ya existe en main.go como /inscriptions/myactivities/:id
	//router.GET("/enrollments/activity/:activity_id", enrollmentController.GetEnrollmentsByActivity) // No implementado en controllers
	router.DELETE("/enrollments/:id", controllers.DeleteInscription) // <--- ADD THIS LINE
}
