package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
)

func PublishPostHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("PublishPostHandler appelé")
		if r.Method != "POST" {
			log.Println("Méthode non POST reçue, méthode actuelle: ", r.Method)
			// Gérer les méthodes autres que POST
			return
		}
		// Récupérer l'ID de l'utilisateur connecté
		session, exists := GetSession(r)
		if !exists {
			log.Println("Aucune session trouvée, redirection vers la page de connexion")
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}
		log.Printf("Session trouvée, ID utilisateur: %d", session.UserID)
		// Récupérer le nom d'utilisateur à partir de l'ID
		var username string
		err := db.QueryRow("SELECT user_name FROM Users WHERE id = ?", session.UserID).Scan(&username)
		if err != nil {
			log.Printf("Erreur lors de la récupération du nom d'utilisateur: %v", err)
			// Gérer l'erreur
			return
		}
		log.Printf("Nom d'utilisateur récupéré: %s", username)
		// Récupérer les informations du poste depuis le formulaire
		err = r.ParseForm()
		if err != nil {
			log.Printf("Erreur lors de l'analyse du formulaire: %v", err)
			return
		}
		categories := r.Form["category[]"]
		title := r.FormValue("title")
		content := r.FormValue("content")
		if len(categories) == 0 {
			categories = append(categories, "Général")
		}
		// fmt.Println("title :", title)
		// fmt.Println("content :", content)
		// fmt.Println("categories :", categories)

		like := "0"
		date := time.Now().Format("2006-01-02 15:04:05")
		log.Printf("Données du formulaire récupérées, Titre: %s, Contenu: %s", title, content)
		uuid := uuid.New().String()
		// Insérer le poste dans la base de données
		_, err = db.Exec("INSERT INTO Posts (link, title, text, date, likes, dislikes, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)", uuid, title, content, date, like, like, session.UserID)
		if err != nil {
			log.Printf("Erreur lors de l'insertion du poste: %v", err)
			// Gérer l'erreur
			return
		}
		////////////////////////////////
		rows, err := db.Query("SELECT id FROM Posts WHERE link = ?", uuid)
		if err != nil {
			fmt.Println("erreur l'ors de la lecture de la query :", err)
			return
		}
		defer rows.Close()
		var id int
		for rows.Next() {
			err := rows.Scan(&id)
			if err != nil {
				fmt.Println(err)
				return

			}
		}
		////////////////////////////////
		var cat_id int
		for _, category := range categories {
			rows, err := db.Query("SELECT id FROM Category WHERE title = ?", category)
			if err != nil {
				fmt.Println("erreur l'ors de la lecture de la query :", err)
				return
			}
			defer rows.Close()
			for rows.Next() {
				err := rows.Scan(&cat_id)
				if err != nil {
					fmt.Println(err)
					return

				}
			}
			_, err = db.Exec("INSERT INTO Category_Post (category_id, post_id) VALUES (?, ?)", cat_id, id)
			if err != nil {
				log.Printf("Erreur lors de l'insertion du poste: %v", err)
				// Gérer l'erreur
				return
			}
		}
		////////////////////////////////

		log.Println("Poste inséré avec succès dans la base de données")
		// Rediriger vers la page montrant le poste ou une autre page appropriée
		log.Println("Redirection vers la page du forum")
		http.Redirect(w, r, "/forum", http.StatusSeeOther)

	}
}
