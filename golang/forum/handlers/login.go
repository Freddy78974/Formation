package handlers

import (
	"database/sql"
	"log"
	"net/http"
)

func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("LoginHandler appelé") // Log au début de la fonction
		switch r.Method {
		case "GET":
			log.Println("Méthode GET détectée pour LoginHandler") // Log pour GET
			session, exists := GetSession(r)
			if exists && session.Authenticated {
				log.Println("Session existante et authentifiée, redirection vers /forum")
				http.Redirect(w, r, "/forum", http.StatusSeeOther)
				return
			}
			log.Println("Affichage de la page de connexion")
			Tmpl.ExecuteTemplate(w, "login.html", nil)

		case "POST":
			log.Println("Méthode POST détectée pour LoginHandler") // Log pour POST
			username := r.FormValue("username")
			password := r.FormValue("password")
			log.Printf("Tentative de connexion avec l'utilisateur: %s\n", username) // Log du nom d'utilisateur

			userExists, err := CheckUserCredentials(db, username, password)
			if err != nil {
				log.Printf("Erreur dans CheckUserCredentials: %v\n", err)
				Tmpl.ExecuteTemplate(w, "login.html", "Identifiant ou mot de passe incorrecte")
				return
			}

			if userExists {
				log.Println("Identifiants valides, récupération de l'ID...")
				var userID int
				err := db.QueryRow("SELECT id FROM Users WHERE user_name = ?", username).Scan(&userID)
				if err != nil {
					log.Printf("Erreur lors de la récupération de l'ID utilisateur: %v\n", err)
					Tmpl.ExecuteTemplate(w, "login.html", "Erreur interne")
					return
				}

				log.Printf("ID utilisateur récupéré: %d, création de la session et redirection", userID)
				CreateSession(userID, username, w)
				http.Redirect(w, r, "/forum", http.StatusSeeOther)
			} else {
				log.Println("Identifiants invalides")
				Tmpl.ExecuteTemplate(w, "login.html", "Identifiants incorrects")
			}

		default:
			log.Println("Méthode non autorisée pour LoginHandler")
			http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		}
	}
}

func ValideUserHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("ValideUserHandler appelé, affichage de la page valideuser et redirection")
	Tmpl.ExecuteTemplate(w, "valideuser.html", nil)
	http.Redirect(w, r, "/login", http.StatusOK)

}
