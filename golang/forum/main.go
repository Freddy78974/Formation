package main

import (
	"fmt"
	"log"
	"net/http"

	h "forum/handlers"

	_ "github.com/mattn/go-sqlite3"
)

// Map pour stocker les sessions

func main() {

	log.Println("Initialisation des templates et de la base de données...")
	h.InitTmpl()
	h.InitSql()
	log.Println("Ouverture de la connexion à la base de données...")
	db, err := h.InitSql()
	// db, err := sql.Open("sqlite3", "db/db.sqlite")
	if err != nil {
		log.Fatal("Erreur lors de l'ouverture de la base de données:", err)
	}
	defer db.Close()
	h.InitQueries()
	if err != nil {
		log.Fatal("Erreur lors de l'ouverture du ficher queries:", err)

	}

	log.Println("Vérification de la connexion à la base de données...")
	log.Println("Vérification de la connexion à la base de données...")
	err = db.Ping()
	if err != nil {
		log.Fatal("Erreur lors de la connexion à la base de données:", err)
	}
	log.Println("Configuration des gestionnaires de route...")

	// Gestionnaires - Certains nécessiteront une mise à jour pour la gestion des sessions
	http.HandleFunc("/signup", h.SignupHandler(db))
	http.HandleFunc("/login", h.LoginHandler(db))
	http.HandleFunc("/forum", h.ForumHandler(db))
	http.HandleFunc("/post", h.PostHandler(db))
	http.HandleFunc("/filtered-content", h.UserLikesDislikesHandler(db))

	// http.HandleFunc("/valideuser", handlers.ValideUserHandler)
	http.HandleFunc("/logout", h.LogoutHandler) // Ajout d'un gestionnaire pour la déconnexion
	http.HandleFunc("/", h.ForumHandler(db))
	http.HandleFunc("/publish-post", h.PublishPostHandler(db))
	http.HandleFunc("/publish-comment", h.PublishCommentHandler(db))
	http.HandleFunc("/like_dislike_forum", h.LikesDislikesHandler(db))
	http.HandleFunc("/like_dislike_post", h.LikesDislikesPostHandler(db))

	// Gestionnaire pour les fichiers statiques
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Votre code pour le FileServer reste inchangé

	fmt.Println("Serveur démarré sur http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
