package clients

import (
	"fmt"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/dao"
	"proyecto2025-Cuello-Kipran-Chihadehh/backend/domain"
	"time"

	log "github.com/sirupsen/logrus"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type MysqlClient struct {
	DB *gorm.DB
}

func NewMysqlClient() *MysqlClient {
	dsnFormat := "%s:%s@tcp(%s:%d)/%s?parseTime=true&charset=utf8mb4&loc=Local"
	dsn := fmt.Sprintf(dsnFormat, "root", "root", "127.0.0.1", 3306, "backend")

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(fmt.Errorf("failed to connect to database: %v", err))
	}

	// Migrar todas las tablas en el orden correcto (respetando foreign keys)
	tables := []interface{}{
		&dao.User{},        // Primero usuarios (no tiene dependencias)
		&dao.Activity{},    // Actividades
		&dao.Inscription{}, // Finalmente inscripciones (depende de User y Activity)
	}

	for _, table := range tables {
		if err := db.AutoMigrate(table); err != nil {
			panic(fmt.Errorf("failed to migrate table %T: %v", table, err))
		}
	}

	// Crear índices adicionales si es necesario
	err = db.Exec(`
		CREATE UNIQUE INDEX IF NOT EXISTS idx_user_activity 
		ON inscriptions (ID_usuario, ID_actividad)
	`).Error
	if err != nil {
		fmt.Printf("Warning: Could not create unique index: %v\n", err)
	}

	return &MysqlClient{
		DB: db,
	}
}

var Db *gorm.DB

type UserClient interface {
	GetAllActivities() ([]dao.Activity, error)
	GetActivityByID(activityID int) (dao.Activity, error)
	SearchActivities(query string) ([]dao.Activity, error)
	CreateActivity(activity dao.Activity) (dao.Activity, error)
	UpdateActivity(activityID int, updatedActivity dao.Activity) (dao.Activity, error)
	DeleteActivity(activityID int) error
	GetUserByUsername(username string) (dao.User, error)
	GetUserByID(userID int) (dao.User, error)
	CreateUser(user dao.User) (dao.User, error)
	CreateInscription(inscription dao.Inscription) (dao.Inscription, error)
	GetUserInscriptions(userID int) ([]dao.Inscription, error)
	CancelInscription(inscriptionID int, userID int) error
}

func init() {
	user := "root"
	password := "Base041104"
	host := "localhost"
	port := 3306
	database := "backend"
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%d)/%s?parseTime=true&charset=utf8mb4&loc=Local",
		user, password, host, port, database)

	var err error
	Db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(fmt.Sprintf("error connecting to DB: %v", err))
	}
	Db.AutoMigrate(&dao.User{})
	Db.Create(&dao.User{
		ID_usuario:   1,
		Username:     "emiliano",
		PasswordHash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
		Is_admin:     true,
	})

	Db.AutoMigrate(&dao.Activity{})
	Db.Create(&dao.Activity{
		ID_actividad: 1,
		Nombre:       "Yoga",
		Descripcion:  "Clase de yoga para principiantes",
		Profesor:     "Juan Perez",
		Cupos:        20,
		Categoria:    "Bienestar",
		ID_timeslot:  dao.TimeSlot{ID_horario: 1},
	})
	Db.AutoMigrate(&dao.TimeSlot{})
	horaInicio, _ := time.Parse("15:04:05", "08:00:00")
	horaFin, _ := time.Parse("15:04:05", "09:30:00")
	Db.Create(&dao.TimeSlot{
		ID_horario:  1,
		Dia:         "Lunes",
		Hora_inicio: horaInicio,
		Hora_fin:    horaFin,
	})

	Db.AutoMigrate(&dao.Inscription{})
	Db.Create(&dao.Inscription{
		ID_inscripcion: 1,
		Estado:         "activa",
		ID_usuario:     1,
		ID_actividad:   1,
	})
}

// ===== MÉTODOS PARA USUARIOS =====

func (c *MysqlClient) GetUserByUsername(username string) (dao.User, error) {
	var userDAO dao.User
	txn := c.DB.First(&userDAO, "username = ?", username)
	if txn.Error != nil {
		return dao.User{}, fmt.Errorf("error getting user: %w", txn.Error)
	}
	return userDAO, nil
}

func (c *MysqlClient) GetUserByID(userID int) (dao.User, error) {
	var user dao.User

	err := c.DB.First(&user, userID).Error
	if err != nil {
		return dao.User{}, fmt.Errorf("error getting user by ID: %w", err)
	}

	return user, nil
}

func (c *MysqlClient) CreateUser(user dao.User) (dao.User, error) {
	err := c.DB.Create(&user).Error
	if err != nil {
		return dao.User{}, fmt.Errorf("error creating user: %w", err)
	}

	return user, nil
}

// ===== MÉTODOS PARA ACTIVIDADES =====

func (c *MysqlClient) GetAllActivities() ([]dao.Activity, error) {
	var activities []dao.Activity

	err := c.DB.Preload("Categoria").Preload("Horario").
		Where("activa = ?", true).Find(&activities).Error
	if err != nil {
		return nil, fmt.Errorf("error getting all activities: %w", err)
	}

	return activities, nil
}
func InsertActividad(actividad domain.Activity) domain.Activity {
	result := Db.Create(&actividad)

	if result.Error != nil {
		log.Println("Error creating actividad:", result.Error)
		log.Error("")
	}
	log.Debug("Actividad Created: ", actividad.ID_actividad)
	return actividad
}
func (c *MysqlClient) GetActivityByID(activityID int) (dao.Activity, error) {
	var activity dao.Activity
	// Preload las relaciones necesarias
	err := c.DB.Preload("Categoria").Preload("Horario").
		First(&activity, activityID).Error
	if err != nil {
		return dao.Activity{}, fmt.Errorf("error getting activity by ID: %w", err)
	}

	return activity, nil
}

func (c *MysqlClient) SearchActivities(query string) ([]dao.Activity, error) {
	var activities []dao.Activity

	searchQuery := "%" + query + "%"
	err := c.DB.Preload("Categoria").Preload("Horario").
		Joins("LEFT JOIN categories ON activities.id_categoria = categories.id_categoria").
		Where("activities.activa = ? AND (activities.nombre LIKE ? OR activities.profesor LIKE ? OR categories.nombre LIKE ?)",
			true, searchQuery, searchQuery, searchQuery).
		Find(&activities).Error

	if err != nil {
		return nil, fmt.Errorf("error searching activities: %w", err)
	}

	return activities, nil
}

func (c *MysqlClient) CreateActivity(activity dao.Activity) (dao.Activity, error) {
	err := c.DB.Create(&activity).Error
	if err != nil {
		return dao.Activity{}, fmt.Errorf("error creating activity: %w", err)
	}

	// Cargar las relaciones antes de devolver
	return c.GetActivityByID(activity.ID_actividad)
}

func (c *MysqlClient) UpdateActivity(activityID int, updatedActivity dao.Activity) (dao.Activity, error) {
	err := c.DB.Model(&dao.Activity{}).Where("id_actividad = ?", activityID).
		Updates(updatedActivity).Error
	if err != nil {
		return dao.Activity{}, fmt.Errorf("error updating activity: %w", err)
	}

	// Devolver la actividad actualizada con sus relaciones
	return c.GetActivityByID(activityID)
}

func (c *MysqlClient) DeleteActivity(activityID int) error {
	// Soft delete - marcar como inactiva
	err := c.DB.Model(&dao.Activity{}).Where("id_actividad = ?", activityID).
		Update("activa", false).Error
	if err != nil {
		return fmt.Errorf("error deleting activity: %w", err)
	}

	return nil
}

// ===== MÉTODOS PARA INSCRIPCIONES =====

func (c *MysqlClient) CreateInscription(inscription dao.Inscription) (dao.Inscription, error) {
	// Verificar que no exista una inscripción previa
	var existingInscription dao.Inscription
	err := c.DB.Where("id_usuario = ? AND id_actividad = ? AND estado = 'activa'",
		inscription.ID_usuario, inscription.ID_actividad).First(&existingInscription).Error

	if err == nil {
		return dao.Inscription{}, fmt.Errorf("user already inscribed to this activity")
	}

	// Verificar cupos disponibles
	var activity dao.Activity
	err = c.DB.First(&activity, inscription.ID_actividad).Error
	if err != nil {
		return dao.Inscription{}, fmt.Errorf("activity not found: %w", err)
	}

	// Contar inscripciones activas
	var count int64
	err = c.DB.Model(&dao.Inscription{}).
		Where("id_actividad = ? AND estado = 'activa'", inscription.ID_actividad).
		Count(&count).Error
	if err != nil {
		return dao.Inscription{}, fmt.Errorf("error counting inscriptions: %w", err)
	}

	if int(count) >= activity.Cupos {
		return dao.Inscription{}, fmt.Errorf("no available spots for this activity")
	}

	// Crear la inscripción
	err = c.DB.Create(&inscription).Error
	if err != nil {
		return dao.Inscription{}, fmt.Errorf("error creating inscription: %w", err)
	}

	// Cargar las relaciones antes de devolver
	err = c.DB.Preload("Actividad").Preload("Actividad.Categoria").
		Preload("Actividad.Horario").First(&inscription, inscription.ID_inscripcion).Error
	if err != nil {
		return dao.Inscription{}, fmt.Errorf("error loading inscription with relations: %w", err)
	}

	return inscription, nil
}

func (c *MysqlClient) GetUserInscriptions(userID int) ([]dao.Inscription, error) {
	var inscriptions []dao.Inscription

	err := c.DB.Preload("Actividad").Preload("Actividad.Categoria").
		Preload("Actividad.Horario").
		Where("id_usuario = ? AND estado = 'activa'", userID).
		Find(&inscriptions).Error

	if err != nil {
		return nil, fmt.Errorf("error getting user inscriptions: %w", err)
	}

	return inscriptions, nil
}

func (c *MysqlClient) CancelInscription(inscriptionID int, userID int) error {
	err := c.DB.Model(&dao.Inscription{}).
		Where("id_inscripcion = ? AND id_usuario = ?", inscriptionID, userID).
		Update("estado", "cancelada").Error

	if err != nil {
		return fmt.Errorf("error canceling inscription: %w", err)
	}

	return nil
}
