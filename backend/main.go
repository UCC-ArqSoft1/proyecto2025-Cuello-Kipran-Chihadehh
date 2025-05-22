package main

import (
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/controllers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Use(cors.Default())

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	//router.GET("/actividades", controllers.GetAllActivities)
	router.GET("/actividad/:id", controllers.GetActivityByID)
	router.GET("/actividades", controllers.GetAllActivities)
	router.GET("/usuario/:username", controllers.GetUserByUsername)
	router.POST("/actividad", controllers.ActividadInsert)
	router.POST("/usuario", controllers.CreateUser)
	router.POST("/login", controllers.Login)
	//router.POST("/RegistrarUsuario", controllers.RegisterUser)

	//router.POST("/inscripcion", controllers.Inscribirse)
	//router.GET("/misActividades/:userId", controllers.MisActividades)
	//router.POST("/login", controllers.Login)

	router.Run(":8080")
}
