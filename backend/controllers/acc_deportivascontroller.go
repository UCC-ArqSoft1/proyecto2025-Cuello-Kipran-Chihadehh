package controllers

import (
	"crypto/sha256"
	"encoding/hex"
	"proyecto2025-cuello-kipran-chihadeh./domain"
)

var usuarios []domain.Usuario // Simula una "base de datos" temporal

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

/*
import (
	"backend/services"
	"strconv"

	"net/http"

	"github.com/gin-gonic/gin"
)

func GetHotelByID(ctx *gin.Context) {
	ctx.Header("Access-Control-Allow-Origin", "*")
	ctx.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	ctx.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

	hotelIDString := ctx.Param("id")
	hotelIDInt, err := strconv.Atoi(hotelIDString)
	if err != nil {
		ctx.String(http.StatusBadRequest, "ID invalido")
		return
	}
	hotel := services.GetHotelByID(hotelIDInt)
	ctx.JSON(http.StatusOK, hotel)
}*/
