package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
)

var (
	Likes    []string
	Dislikes []string
)

func LikesDislikesHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("LikesDislikesHandler appelé")
		like := r.FormValue("like")
		dislike := r.FormValue("dislike")
		var link string
		var action string
		if like == "" {
			link = dislike
			action = "dislike"
		} else {
			link = like
			action = "like"
		}

		GetPostLikes(db, link)
		GetPostDislikes(db, link)
		session, exists := GetSession(r)
		if !exists {
			log.Println("Aucune session trouvée, redirection vers la page de connexion")
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}
		UpdateLikesPost(db, session.UserID, action, link)

		// GetCommentLikes(db, id)

		http.Redirect(w, r, "/forum", http.StatusSeeOther)

	}
}
func LikesDislikesPostHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("LikesDislikesPostHandler appelé")
		like := r.FormValue("like")
		dislike := r.FormValue("dislike")
		var link string
		var action string
		if like == "" {
			link = dislike
			action = "dislike"
		} else {
			link = like
			action = "like"
		}

		GetPostLikes(db, link)
		GetPostDislikes(db, link)
		session, exists := GetSession(r)
		if !exists {
			log.Println("Aucune session trouvée, redirection vers la page de connexion")
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}
		UpdateLikesPost(db, session.UserID, action, link)

		// GetCommentLikes(db, id)

		http.Redirect(w, r, ("/post?id=" + link), http.StatusSeeOther)

	}
}

func GetPostLikes(db *sql.DB, link string) {
	rows, err := db.Query("SELECT likes FROM Posts WHERE link = ?;", link)
	if err != nil {
		fmt.Println("erreur l'ors de la lecture de la query :", err)
		return
	}
	defer rows.Close()

	likes := ""
	for rows.Next() {

		err := rows.Scan(&likes)
		if err != nil {
			fmt.Println(err)
			return
		}
		Likes = strings.Split(likes, ",")
	}

}
func GetPostDislikes(db *sql.DB, link string) {
	rows, err := db.Query("SELECT dislikes FROM Posts WHERE link = ?;", link)
	if err != nil {
		fmt.Println("erreur l'ors de la lecture de la query :", err)
		return
	}
	defer rows.Close()

	dislikes := ""
	for rows.Next() {

		err := rows.Scan(&dislikes)
		if err != nil {
			fmt.Println(err)
			return
		}
		Dislikes = strings.Split(dislikes, ",")
	}

}
func UpdateLikesPost(db *sql.DB, user_id int, action string, link string) {
	likestab := Likes
	dislikestab := Dislikes
	userIDStr := strconv.Itoa(user_id)

	// Fonction pour supprimer un élément de la liste
	removeFromList := func(list []string, item string) []string {
		for i, v := range list {
			if v == item {
				return append(list[:i], list[i+1:]...)
			}
		}
		return list
	}

	if action == "like" {
		if contains(likestab, userIDStr) {
			likestab = removeFromList(likestab, userIDStr)
		} else {
			dislikestab = removeFromList(dislikestab, userIDStr)
			likestab = append(likestab, userIDStr)
		}
	} else if action == "dislike" {
		if contains(dislikestab, userIDStr) {
			dislikestab = removeFromList(dislikestab, userIDStr)
		} else {
			likestab = removeFromList(likestab, userIDStr)
			dislikestab = append(dislikestab, userIDStr)
		}
	}

	likes := strings.Join(likestab, ",")
	dislikes := strings.Join(dislikestab, ",")

	query := "UPDATE Posts SET likes = ?, dislikes = ? WHERE link = ?"
	_, err := db.Exec(query, likes, dislikes, link)
	if err != nil {
		log.Println("Erreur lors de la mise à jour des likes et dislikes du post :", err)
	}
}

// Fonction auxiliaire pour vérifier si une liste contient un élément
func contains(list []string, item string) bool {
	for _, v := range list {
		if v == item {
			return true
		}
	}
	return false
}
func UpdateLikesComments(db *sql.DB, likes []string, dislikes []string, user_id int, action string, id int) {

	present := false
	if action == "like" {
		for i, r := range dislikes {
			id, err := strconv.Atoi(r)
			if err != nil {
				log.Println("Erreur l'ors de la lecture des likes&dislikes :", err)
			}
			if id == user_id {
				dislikes = append(dislikes[:i], dislikes[i+1:]...)
			}
		}
		for _, r := range likes {
			id, err := strconv.Atoi(r)
			if err != nil {
				log.Println("Erreur l'ors de la lecture des likes&dislikes :", err)
			}
			if id == user_id {
				present = true
			}
		}
		if !present {
			likes = append(likes, strconv.Itoa(user_id))
		}
	}
	if action == "dislike" {
		for i, r := range likes {
			id, err := strconv.Atoi(r)
			if err != nil {
				log.Println("Erreur l'ors de la lecture des likes&dislikes :", err)
			}
			if id == user_id {
				likes = append(likes[:i], likes[i+1:]...)
			}
		}
		for _, r := range dislikes {
			id, err := strconv.Atoi(r)
			if err != nil {
				log.Println("Erreur l'ors de la lecture des likes&dislikes :", err)
			}
			if id == user_id {
				present = true
			}
		}
		if !present {
			dislikes = append(dislikes, strconv.Itoa(user_id))
		}
	}
	likes_str := strings.Join(likes, ",")
	dislikes_str := strings.Join(dislikes, ",")

	query := "UPDATE Comments SET likes = ?, dislikes = ? WHERE id = ?"

	_, err := db.Exec(query, likes_str, dislikes_str, id)
	if err != nil {
		log.Println("Erreur lors de la mise à jour des likes et dislikes du comment :", err)
	}

}

func GetCommentLikes(db *sql.DB, id int) []string {
	rows, err := db.Query("SELECT likes FROM Comments WHERE id = ?;", id)
	if err != nil {
		fmt.Println("erreur l'ors de la lecture de la query :", err)
		return nil
	}
	defer rows.Close()

	likes := ""
	var likesTab []string
	for rows.Next() {

		err := rows.Scan(&likes)
		if err != nil {
			fmt.Println(err)
			return nil
		}
		likesTab = strings.Split(likes, ",")
	}
	return likesTab
}
func GetCommentDislikes(db *sql.DB, id int) []string {
	rows, err := db.Query("SELECT dislikes FROM Comments WHERE id = ?;", id)
	if err != nil {
		fmt.Println("erreur l'ors de la lecture de la query :", err)
		return nil
	}
	defer rows.Close()

	dislikes := ""
	var dislikesTab []string
	for rows.Next() {

		err := rows.Scan(&dislikes)
		if err != nil {
			fmt.Println(err)
			return nil
		}
		dislikesTab = strings.Split(dislikes, ",")
	}
	return dislikesTab
}

func GetLikedPosts(db *sql.DB, userID int) ([]Post, error) {
	var posts []Post
	userIDStr := strconv.Itoa(userID)

	log.Println("Récupération des posts aimés pour l'utilisateur ID:", userID)

	query := strings.Join(Queries[Select_LikesStart:Select_LikesEnd], "\n")
	rows, err := db.Query(query, "%,"+userIDStr+",%")
	if err != nil {
		log.Println("Erreur lors de la récupération des posts aimés:", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var post Post
		var like string
		var dislike string
		if err := rows.Scan(&post.Id, &post.Title, &post.Link, &post.Date, &post.Text, &like, &dislike, &post.Categories, &post.User_name); err != nil {
			log.Println("Erreur lors du scan des données de post:", err)
			return nil, err
		}
		post.Likes = ExtractLikesDislikes(like)
		post.Dislikes = ExtractLikesDislikes(dislike)
		posts = append(posts, post)
		fmt.Println("post :", post)
	}
	log.Println("Nombre de posts aimés récupérés:", len(posts))
	return posts, nil
}

func GetDislikedPosts(db *sql.DB, userID int) ([]Post, error) {
	var posts []Post

	query := `SELECT id, title FROM Posts WHERE FIND_IN_SET(?, dislikes) > 0;`
	rows, err := db.Query(query, strconv.Itoa(userID))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var post Post
		if err := rows.Scan(&post.Id, &post.Title); err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}
