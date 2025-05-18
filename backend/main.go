package main

import (
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Use(cors.Default())

	//router.GET("/actividades", controllers.GetAllActivities)
	router.GET("/actividad/:id", controllers.GetActivityByID)
	//router.POST("/inscripcion", controllers.Inscribirse)
	//router.GET("/misActividades/:userId", controllers.MisActividades)

	router.POST("/login", controllers.Login)

	router.Run(":8080")
}
