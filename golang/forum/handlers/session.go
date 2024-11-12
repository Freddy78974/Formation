package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var SessionMap = map[string]Session{}

// Fonction pour créer une nouvelle session
func CreateSession(userID int, username string, w http.ResponseWriter) {
	log.Printf("Tentative de création d'une nouvelle session pour l'utilisateur %s (ID: %d)\n", username, userID)

	// Supprimer l'ancienne session de l'utilisateur, s'il y en a une
	for sessionID, session := range SessionMap {
		if session.UserID == userID {
			log.Printf("Suppression de l'ancienne session (ID: %s) pour l'utilisateur %s\n", sessionID, username)
			delete(SessionMap, sessionID)
		}
	}

	// Créer la nouvelle session
	newSessionID := uuid.New().String()
	cookie := http.Cookie{Name: "session_id", Value: newSessionID, Path: "/", HttpOnly: true, Secure: true}
	http.SetCookie(w, &cookie)

	SessionMap[newSessionID] = Session{Username: username, UserID: userID, Authenticated: true}
	log.Printf("Nouvelle session créée (ID: %s) pour l'utilisateur %s\n", newSessionID, username)
}

// Fonction pour obtenir une session
func GetSession(r *http.Request) (Session, bool) {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		log.Println("Aucun cookie de session trouvé dans la requête")
		return Session{}, false
	}

	session, exists := SessionMap[cookie.Value]
	if !exists {
		log.Printf("Aucune session valide trouvée pour le cookie (ID: %s)\n", cookie.Value)
		return Session{}, false
	}

	log.Printf("Session trouvée (ID: %s) pour l'utilisateur %s\n", cookie.Value, session.Username)
	return session, true
}

// Fonction pour supprimer une session
func DeleteSession(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		return
	}
	delete(SessionMap, cookie.Value)
	cookie.MaxAge = -1
	http.SetCookie(w, cookie)
}

// CheckUserCredentials vérifie les identifiants de l'utilisateur dans la base de données.
// Elle retourne true si l'utilisateur existe avec le mot de passe fourni, sinon false.
func CheckUserCredentials(db *sql.DB, username, password string) (bool, error) {
	var hashedPassword string

	// Mise à jour de la requête pour utiliser la table 'Utilisateurs'
	query := "SELECT password FROM Users WHERE user_name = ?"

	err := db.QueryRow(query, username).Scan(&hashedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			err = fmt.Errorf("aucun utilisateur trouvé avec ce nom d'utilisateur")
			return false, err
		}
		err = fmt.Errorf("erreur s'est produite lors de la requête à la base de données")
		return false, err
	}

	// Comparer le mot de passe fourni avec le mot de passe haché stocké.
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		err = fmt.Errorf("le mot de passe ne correspond pas")
		return false, err
	}

	// L'utilisateur existe et le mot de passe est correct.
	return true, nil
}
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	// Supprimer la session
	DeleteSession(w, r)
	http.Redirect(w, r, "/login", http.StatusSeeOther)
}

// GetUserFromSession retourne l'ID de l'utilisateur connecté à partir de la session
func GetUserFromSession(db *sql.DB, r *http.Request) (int, error) {
	// Récupérer la session
	session, exists := GetSession(r)
	if !exists {
		return 0, fmt.Errorf("aucune session trouvée")
	}

	// Récupérer l'ID de l'utilisateur à partir du nom d'utilisateur dans la session
	var userID int
	query := "SELECT id FROM Users WHERE user_name = ?"
	err := db.QueryRow(query, session.Username).Scan(&userID)
	if err != nil {
		if err == sql.ErrNoRows {
			// L'utilisateur n'existe pas
			return 0, fmt.Errorf("utilisateur non trouvé")
		}
		return 0, err
	}

	return userID, nil
}
