package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func PostHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		link := r.URL.Query().Get("id")

		switch r.Method {
		case http.MethodGet:

			GetPost(db, link)
			session, _ := GetSession(r)
			var data Data
			data.Posts = Posts
			data.Session = session
			GetComments(db, link)
			data.Comments = Comments
			Tmpl.ExecuteTemplate(w, "post.html", data)
		case http.MethodPost:

			like := r.FormValue("like")
			dislike := r.FormValue("dislike")
			var id int
			var action string
			var err error
			if like == "" {
				id, err = strconv.Atoi(dislike)
				action = "dislike"
			} else {
				id, err = strconv.Atoi(like)
				action = "like"
			}
			if err != nil {
				log.Fatal(err)
				Erreur(w, r, http.StatusInternalServerError) // rajouter
			}

			likes := GetCommentLikes(db, id)
			dislikes := GetCommentDislikes(db, id)
			session, exists := GetSession(r)
			if !exists {
				log.Println("Aucune session trouvée, redirection vers la page de connexion")
				http.Redirect(w, r, "/login", http.StatusSeeOther)
				return
			}
			UpdateLikesComments(db, likes, dislikes, session.UserID, action, id)

			GetPost(db, link)
			var data Data
			data.Posts = Posts
			data.Session = session
			GetComments(db, link)
			data.Comments = Comments
			Tmpl.ExecuteTemplate(w, "post.html", data)
		}
	}
}
func GetPost(db *sql.DB, link string) {
	rows, err := db.Query(strings.Join(Queries[Select_Post2_Join_Start:Select_Post2_Join_End], "\n"), link)
	if err != nil {
		return
	}
	defer rows.Close()

	Posts = nil
	for rows.Next() {
		var post Post
		var likes string
		var dislikes string
		err := rows.Scan(&post.Id, &post.Title, &post.Link, &post.Date, &post.Text, &likes, &dislikes, &post.Categories, &post.User_name)
		if err != nil {
			fmt.Println(err)
			return

		}
		post.Likes = ExtractLikesDislikes(likes)
		post.Dislikes = ExtractLikesDislikes(dislikes)
		// fmt.Println(post)
		Posts = append(Posts, post)
	}

}
func GetComments(db *sql.DB, link string) {
	// fmt.Println(Posts)
	post := Posts[0]
	// fmt.Println(post)

	rows, err := db.Query(Queries[Select_Link_Comment], post.Id)
	if err != nil {
		return
	}
	defer rows.Close()

	Comments = nil
	for rows.Next() {
		var comment Comment
		var likes string
		var dislikes string
		err := rows.Scan(&comment.Id, &comment.Date, &comment.Text, &likes, &dislikes, &comment.User_id, &comment.Post_id)
		if err != nil {
			fmt.Println(err)
			return

		}
		comment.Likes = ExtractLikesDislikes(likes)
		comment.Dislikes = ExtractLikesDislikes(dislikes)
		Comments = append(Comments, comment)

	}
}

func PublishCommentHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("PublishCommentHandler appelé")
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
			Erreur(w, r, http.StatusInternalServerError) // rajouter
			return
		}
		log.Printf("Nom d'utilisateur récupéré: %s", username)
		// Récupérer les informations du poste depuis le formulaire

		content := r.FormValue("content")

		like := "0"
		date := time.Now().Format("2006-01-02 15:04:05")
		log.Printf("Données du formulaire récupérées, Contenu: %s", content)
		post := Posts[0]

		// Insérer le poste dans la base de données
		_, err = db.Exec("INSERT INTO Comments (text, date, likes, dislikes, user_id, post_id) VALUES (?, ?, ?, ?, ?, ?)", content, date, like, like, session.UserID, post.Id)
		if err != nil {
			log.Printf("Erreur lors de l'insertion du poste: %v", err)
			// Gérer l'erreur
			Erreur(w, r, http.StatusInternalServerError) // rajouter
			return
		}
		log.Println("Poste inséré avec succès dans la base de données")
		// Rediriger vers la page montrant le poste ou une autre page appropriée
		log.Println("Redirection vers la page du forum")
		http.Redirect(w, r, ("/post?id=" + post.Link), http.StatusSeeOther)

	}
}
