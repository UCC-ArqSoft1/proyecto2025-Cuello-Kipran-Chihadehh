package utils

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"backend/clients" // Importar el paquete clients para acceder a la base de datos

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const (
	jwtDuration = time.Hour * 24
	jwtSecret   = "jwtSecret"
)

func GenerateJWT(UserID int) (string, error) {
	//setear expiracion
	expirationTime := time.Now().Add(jwtDuration)

	//crear el claims

	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(expirationTime),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		NotBefore: jwt.NewNumericDate(time.Now()),
		Issuer:    "backend",
		Subject:   "auth",
		ID:        fmt.Sprintf("%d", UserID),
	}

	//crear el token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	//firmar el token
	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", fmt.Errorf("error signing token: %v", err)
	}

	return tokenString, nil
}

var JWT_SECRET = []byte(jwtSecret)

func JwtAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token no proporcionado o inválido"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("método de firma inesperado")
			}
			return JWT_SECRET, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Claims inválidos"})
			c.Abort()
			return
		}

		if userIDStr, ok := claims["jti"].(string); ok {
			if userID, err := strconv.Atoi(userIDStr); err == nil {
				c.Set("user_id", userID)

				// Obtener el usuario de la base de datos para verificar si es admin
				user, err := clients.GetUserByID(userID) // Asumiendo que GetUserByID está en clients
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener información del usuario"})
					c.Abort()
					return
				}
				c.Set("is_admin", user.IsAdmin) // Almacenar el estado de administrador en el contexto

			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "ID de usuario inválido en token"})
				c.Abort()
				return
			}
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "ID de usuario no encontrado en token"})
			c.Abort()
			return
		}

		c.Next()
	}
}
func AdminAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		isAdmin, exists := c.Get("is_admin")
		if !exists || isAdmin != true {
			c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado. Se requiere rol de administrador."})
			c.Abort()
			return
		}
		c.Next()
	}
}
