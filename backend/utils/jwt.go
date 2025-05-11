package utils

import (
	"fmt"
	"time"

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
