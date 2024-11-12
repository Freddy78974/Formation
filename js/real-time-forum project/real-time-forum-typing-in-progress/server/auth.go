package server

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type UserStruct struct {
	Id           int    `json:"id"`
	FirstName    string `json:"firstName"`
	LastName     string `json:"lastName"`
	Username     string `json:"username"`
	Gender       string `json:"gender"`
	Age          string `json:"age"`
	GenderCustom string `json:"genderCustom"`
	Email        string `json:"email"`
	Password     string `json:"password"`
}

type LoginStruct struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Response struct {
	Status string
	Error  string
	User   UserStruct
}

func Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erreur de lecture du corps de la requête", http.StatusInternalServerError)
		return
	}

	var data UserStruct
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Erreur lors du décodage JSON", http.StatusBadRequest)
		return
	}

	var response Response

	userId, err := AddNewUser(data)
	if err != nil {
		response.Status = "error"
		response.Error = err.Error()
	} else {
		response.Status = "success"
	}
	data.Id = int(userId)
	response.User = data
	var userAppend UserConnection

	userAppend.Id = data.Id
	userAppend.Status = "offline"
	userAppend.Username = data.Username

	usersList = append(usersList, userAppend)
	responseData, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)
}

func AddNewUser(data UserStruct) (int64, error) {
	db, err := sql.Open("sqlite3", "./db/rtf.db")
	if err != nil {
		return 0, err
	}
	defer db.Close()

	query := `INSERT INTO users (username, first_name, last_name, gender, custom_gender, mail, password) VALUES (?, ?, ?, ?, ?, ?, ?)`
	result, err := db.Exec(query, data.Username, data.FirstName, data.LastName, data.Gender, data.GenderCustom, data.Email, data.Password)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return id, nil
}

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)

	if err != nil {
		http.Error(w, "Erreur de lecture du corps de la requête", http.StatusInternalServerError)
		return
	}

	var data LoginStruct
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Erreur lors du décodage JSON", http.StatusBadRequest)
		return
	}

	users, _ := CheckIfUserExiste(data)

	var response Response
	response.User = users

	if users.Username == "" {
		response.Status = "error"
	} else {
		response.Status = "success"
	}
	fmt.Println(response)

	responseData, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)
}

func CheckIfUserExiste(data LoginStruct) (UserStruct, error) {
	db, err := sql.Open("sqlite3", "./db/rtf.db")
	if err != nil {
		return UserStruct{}, err
	}
	defer db.Close()
	query := "SELECT id, username, first_name, last_name, gender, custom_gender, mail FROM users WHERE (mail = ? OR username = ?) AND password = ?"
	rows, err := db.Query(query, data.Email, data.Email, data.Password)
	if err != nil {
		return UserStruct{}, err
	}
	fmt.Println(rows)
	defer rows.Close()
	var UserStructValue UserStruct
	for rows.Next() {
		err := rows.Scan(&UserStructValue.Id, &UserStructValue.Username,
			&UserStructValue.FirstName, &UserStructValue.LastName,
			&UserStructValue.Gender, &UserStructValue.GenderCustom,
			&UserStructValue.Email)
		if err != nil {
			return UserStruct{}, err
		}
	}
	return UserStructValue, nil
}
