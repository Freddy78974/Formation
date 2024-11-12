package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

func ForumHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" || r.URL.Path == "/forum" ||
			r.URL.Path == "/login" || r.URL.Path == "/signup" ||
			r.URL.Path == "/logout" || r.URL.Path == "/publish-post" ||
			r.URL.Path == "/publish-comment" || r.URL.Path == "/like_dislike_forum" ||
			r.URL.Path == "/like_dislike_post" || r.URL.Path == "/filtered-content" ||
			r.URL.Path == "/valideuser" {
			GetPosts(db)
			GetCategories(db)

			session, _ := GetSession(r)
			var data Data
			data.Posts = Posts
			data.Session = session
			data.Categories = Categories

			// Servir la page du forum si l'utilisateur est authentifié
			Tmpl.ExecuteTemplate(w, "forum.html", data)
		} else {
			Erreur(w, r, http.StatusBadRequest) // rajouter
		}
	}
}

func GetPosts(db *sql.DB) {
	rows, err := db.Query(strings.Join(Queries[Select_Post_Join_Start:Select_Post_Join_End], "\n"))
	if err != nil {
		fmt.Println("erreur l'ors de la lecture de la query :", err)
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
		Posts = append(Posts, post)
	}

}
func GetCategories(db *sql.DB) {
	rows, err := db.Query("SELECT * FROM Category")
	if err != nil {
		return
	}
	defer rows.Close()

	Categories = nil
	for rows.Next() {
		var category Category
		err := rows.Scan(&category.id, &category.Title)
		if err != nil {
			fmt.Println(err)
			return

		}
		Categories = append(Categories, category)
	}
}
func ExtractLikesDislikes(likesDislikesString string) []string {
	// Divise la chaîne en un tableau de chaînes.
	likesDislikesArray := strings.Split(likesDislikesString, ",")

	// Initialise un nouveau tableau pour stocker les résultats non nuls.
	var result []string

	// Parcours le tableau et exclut les "0".
	for _, str := range likesDislikesArray {
		// Convertit la chaîne en un entier.
		num, err := strconv.Atoi(str)
		if err != nil {
			fmt.Println("Erreur lors de la conversion de la chaîne en entier:", err)
			continue
		}

		// Ajoute la chaîne non nulle à la liste des résultats.
		if num != 0 {
			result = append(result, str)
		}
	}

	return result
}
