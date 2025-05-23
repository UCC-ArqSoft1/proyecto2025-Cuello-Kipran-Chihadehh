package clients

import (
	"backend/dao"
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var (
	DB *gorm.DB
)

type MysqlClient struct {
	DB *gorm.DB
}

func NewMysqlClient() *MysqlClient {
	dsnFormat := "%s:%s@tcp(%s:%d)/%s?parseTime=true&charset=utf8mb4&loc=Local"
	//server isma
	//dsn := fmt.Sprintf(dsnFormat, "root", "Dinorex-2025", "localhost", 3306, "gym-db")
	//server lucas
	dsn := fmt.Sprintf(dsnFormat, "root", "root", "localhost", 3306, "backend")

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(fmt.Errorf("failed to connect to database: %v", err))
	}

	// IMPORTANTE: Asignar la conexión a la variable global DB ANTES de hacer migraciones
	DB = db

	// Migrar todas las tablas en el orden correcto (respetando foreign keys)
	err = DB.AutoMigrate(&dao.User{})
	if err != nil {
		panic(fmt.Errorf("failed to migrate User table: %v", err))
	}

	err = DB.AutoMigrate(&dao.Activity{})
	if err != nil {
		panic(fmt.Errorf("failed to migrate Activity table: %v", err))
	}

	err = DB.AutoMigrate(&dao.Inscription{})
	if err != nil {
		panic(fmt.Errorf("failed to migrate Inscription table: %v", err))
	}

	// Crear índices adicionales si es necesario
	err = DB.Exec(`
		CREATE UNIQUE INDEX IF NOT EXISTS idx_user_activity 
		ON inscriptions (ID_usuario, ID_actividad)
	`).Error
	if err != nil {
		fmt.Printf("Warning: Could not create unique index: %v\n", err)
	}

	fmt.Println("Database migration completed successfully")

	return &MysqlClient{
		DB: db,
	}
}

// ================ USER METHODS ================

// GetUserByID obtiene un usuario por su ID
func GetUserByID(id int) (dao.User, error) {
	var user dao.User
	if err := DB.First(&user, id).Error; err != nil {
		return dao.User{}, err
	}
	return user, nil
}

// GetUserByUsername obtiene un usuario por su username
func GetUserByUsername(username string) (dao.User, error) {
	var user dao.User
	if err := DB.Where("username = ?", username).First(&user).Error; err != nil {
		return dao.User{}, err
	}
	return user, nil
}

// CreateUser crea un nuevo usuario en la base de datos
func CreateUser(user dao.User) (dao.User, error) {
	if err := DB.Create(&user).Error; err != nil {
		return dao.User{}, err
	}
	return user, nil
}

// GetAllUsers obtiene todos los usuarios
func GetAllUsers() ([]dao.User, error) {
	var users []dao.User
	if err := DB.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// UpdateUser actualiza un usuario existente
func UpdateUser(user dao.User) error {
	return DB.Save(&user).Error
}

// DeleteUser elimina un usuario por ID
func DeleteUser(id int) error {
	return DB.Delete(&dao.User{}, id).Error
}

// ================ ACTIVITY METHODS ================

// GetActivityByID obtiene una actividad por su ID
func GetActivityByID(id int) (dao.Activity, error) {
	var activity dao.Activity
	if err := DB.First(&activity, id).Error; err != nil {
		return dao.Activity{}, err
	}
	return activity, nil
}

// GetActivities obtiene todas las actividades
func GetActivities() (dao.Activities, error) {
	var activities dao.Activities
	if err := DB.Find(&activities).Error; err != nil {
		return nil, err
	}
	return activities, nil
}

// InsertActivity crea una nueva actividad en la base de datos
func InsertActivity(activity dao.Activity) (dao.Activity, error) {
	if err := DB.Create(&activity).Error; err != nil {
		return dao.Activity{}, err
	}
	return activity, nil
}

// GetActivitiesByCategory obtiene actividades por categoría
func GetActivitiesByCategory(categoria string) (dao.Activities, error) {
	var activities dao.Activities
	if err := DB.Where("categoria = ?", categoria).Find(&activities).Error; err != nil {
		return nil, err
	}
	return activities, nil
}

// GetActivitiesByProfesor obtiene actividades por profesor
func GetActivitiesByProfesor(profesor string) (dao.Activities, error) {
	var activities dao.Activities
	if err := DB.Where("profesor = ?", profesor).Find(&activities).Error; err != nil {
		return nil, err
	}
	return activities, nil
}

// GetActivitiesByDay obtiene actividades por día
func GetActivitiesByDay(dia string) (dao.Activities, error) {
	var activities dao.Activities
	if err := DB.Where("dia = ?", dia).Find(&activities).Error; err != nil {
		return nil, err
	}
	return activities, nil
}

// UpdateActivity actualiza una actividad existente
func UpdateActivity(activity dao.Activity) error {
	return DB.Save(&activity).Error
}

// DeleteActivity elimina una actividad por ID
func DeleteActivity(id int) error {
	return DB.Delete(&dao.Activity{}, id).Error
}

// GetActivitiesWithAvailableSlots obtiene actividades con cupos disponibles
func GetActivitiesWithAvailableSlots() (dao.Activities, error) {
	var activities dao.Activities
	if err := DB.Where("cupos > 0").Find(&activities).Error; err != nil {
		return nil, err
	}
	return activities, nil
}

// UpdateActivitySlots actualiza los cupos de una actividad
func UpdateActivitySlots(id int, newSlots int) error {
	return DB.Model(&dao.Activity{}).Where("id_actividad = ?", id).Update("cupos", newSlots).Error
}

// SearchActivitiesByName busca actividades por nombre (búsqueda parcial)
func SearchActivitiesByName(name string) (dao.Activities, error) {
	var activities dao.Activities
	searchPattern := "%" + name + "%"
	if err := DB.Where("nombre LIKE ?", searchPattern).Find(&activities).Error; err != nil {
		return nil, err
	}
	return activities, nil
}
