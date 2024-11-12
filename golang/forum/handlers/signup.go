package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

var UserLvl = "user"

func SignupHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			// Traitement du formulaire
			err := ProcessSignupForm(db, w, r)
			if err != nil {
				// Gérer l'erreur - Rediriger vers la page de connexion avec un message d'erreur
				// http.Redirect(w, r, "/", http.StatusSeeOther)
				Tmpl.ExecuteTemplate(w, "signup.html", err)

				return
			}

			// Inscription réussie - Rediriger vers le forum
			http.Redirect(w, r, "/valideuser", http.StatusSeeOther)
		} else {
			// Afficher le formulaire d'inscription

			Tmpl.ExecuteTemplate(w, "signup.html", nil)
		}
	}
}
func ProcessSignupForm(db *sql.DB, w http.ResponseWriter, r *http.Request) error {
	username := strings.TrimSpace(r.FormValue("Username"))
	email := strings.TrimSpace(r.FormValue("Email"))
	password := r.FormValue("Password")

	if username == "" || email == "" || password == "" {
		return fmt.Errorf("les champs ne doivent pas être vides")
	}

	if len(username) < 3 || len(username) > 20 {
		return fmt.Errorf("le nom d'utilisateur doit contenir entre 3 et 20 caractères")
	}

	if len(password) < 6 {
		return fmt.Errorf("le mot de passe doit contenir au moins 6 caractères")
	}

	// Validation simple du format de l'email
	emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	if !emailRegex.MatchString(email) {
		return fmt.Errorf("format de l'email invalide")
	}

	existence, err := UserExists(db, username, email)
	if err != nil {
		return fmt.Errorf("erreur lors de la vérification de l'utilisateur: %v", err)
	}

	if existence.UsernameExists {
		return fmt.Errorf("nom d'utilisateur déjà utilisé")
	}

	if existence.EmailExists {
		return fmt.Errorf("e-mail déjà utilisé")
	}

	return CreateUserInDatabase(db, username, password, email)
}
func CreateUserInDatabase(db *sql.DB, username, password, email string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Erreur lors du hachage du mot de passe : %v", err)
		return err
	}

	stmt, err := db.Prepare("INSERT INTO Users (user_name, password, e_mail, lvl) VALUES (?, ?, ?, ?)")
	if err != nil {
		log.Printf("Erreur lors de la préparation de la requête d'insertion : %v", err)
		return err
	}
	defer stmt.Close()

	ok, err := stmt.Exec(username, string(hashedPassword), email, UserLvl)
	fmt.Println(ok)
	if err != nil {
		log.Printf("Erreur lors de l'exécution de la requête d'insertion : %v", err)
		return err
	}
	log.Printf("Utilisateur '%s' créé avec succès", username)
	return nil
}
func UserExists(db *sql.DB, username, email string) (UserExistence, error) {
	var existence UserExistence

	usernameQuery := `SELECT EXISTS(SELECT 1 FROM Users WHERE user_name = ?)`
	err := db.QueryRow(usernameQuery, username).Scan(&existence.UsernameExists)
	if err != nil {
		log.Println("Erreur lors de la vérification du nom d'utilisateur:", err)
		return existence, err
	}

	emailQuery := `SELECT EXISTS(SELECT 1 FROM Users WHERE e_mail = ?)`
	err = db.QueryRow(emailQuery, email).Scan(&existence.EmailExists)
	if err != nil {
		log.Println("Erreur lors de la vérification de l'email:", err)
		return existence, err
	}

	return existence, nil
}

func UserLikesDislikesHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, exists := GetSession(r)
		if !exists {
			log.Println("Aucune session trouvée, redirection vers la page de connexion")
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}

		// Récupérer les posts aimés et non aimés par l'utilisateur
		likedPosts, err := GetLikedPosts(db, session.UserID)
		fmt.Println("likedPosts :", likedPosts)
		if err != nil {
			log.Println("Erreur lors de la récupération des posts aimés:", err)
			Erreur(w, r, http.StatusInternalServerError) // rajouter
			return
		}

		// dislikedPosts, err := GetLikedPosts(db, session.UserID)
		// if err != nil {
		// 	log.Println("Erreur lors de la récupération des posts non aimés:", err)
		// 	http.Error(w, "Erreur interne", http.StatusInternalServerError)
		// 	return
		// }

		// TODO: Envoyer les données au front-end (à adapter selon votre mise en page et format de réponse)
		// Par exemple, vous pouvez encoder les résultats en JSON et les envoyer
		var data Data
		data.Posts = likedPosts
		data.Session = session
		data.Categories = Categories

		// Servir la page du forum si l'utilisateur est authentifié
		Tmpl.ExecuteTemplate(w, "forum.html", data)
	}
}
