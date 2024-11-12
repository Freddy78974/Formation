package server

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type CategorieStruct struct {
	Id        int    `json:"id"`
	Categorie string `json:"categories_name"`
}

type PostStruct struct {
	Title     string `json:"title"`
	Content   string `json:"content"`
	Categorie string `json:"categorie"`
	User      string `json:"user"`
}

type GetPostStruct struct {
	Id           int    `json:"id"`
	Title        string `json:"title"`
	Content      string `json:"content"`
	Categorie    string `json:"categorie"`
	Username     string `json:"username"`
	CreationDate string `json:"creation_date"`
	Slug         string `json:"slug"`
}

type CommentsStruct struct {
	Id           int    `json:"id"`
	Content      string `json:"content"`
	Username     string `json:"username"`
	CreationDate string `json:"creation_date"`
}

type MessageRequest struct {
	User1  string `json:"user1"`
	User2  string `json:"user2"`
	Offset int    `json:"offset"`
	Limit  int    `json:"limit"`
}

type UserSendMessage struct {
	UserReceiveId string `json:"user_receive_id"`
	UserSendId    string `json:"user_send_id"`
	Message       string `json:"message"`
}

type ChatMessage struct {
	ID             int    `json:"id"`
	SenderUserID   int    `json:"sender_user_id"`
	ReceiverUserID int    `json:"receiver_user_id"`
	Message        string `json:"message"`
	Date           string `json:"date"`
}

// ! need to fusion CommentsStructWithPostId & CommentsStruct
type CommentsStructWithPostId struct {
	Id      int    `json:"id"`
	Content string `json:"content"`
	PostId  string `json:"postid"`
	User    string `json:"user"`
}

type IdStruct struct {
	ID string `json:"id"`
}

func GetAllCategorie(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		return
	}

	response, err := fetchCategories()
	if err != nil {
		http.Error(w, "Erreur fetchCategories", http.StatusInternalServerError)
		return
	}

	responseData, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)
}

func fetchCategories() ([]CategorieStruct, error) {
	db, err := sql.Open("sqlite3", "./db/rtf.db")
	if err != nil {
		return nil, err
	}
	defer db.Close()

	query := "SELECT id, categories_name FROM forum_categorie"
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []CategorieStruct
	for rows.Next() {
		var categorieStruct CategorieStruct
		if err := rows.Scan(&categorieStruct.Id, &categorieStruct.Categorie); err != nil {
			return nil, err
		}
		categories = append(categories, categorieStruct)
	}

	return categories, nil
}

func AddNewPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erreur de lecture du corps de la requête", http.StatusInternalServerError)
		return
	}

	var data PostStruct
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Erreur lors du décodage JSON", http.StatusBadRequest)
		return
	}

	var userData UserStruct
	err = json.Unmarshal([]byte(data.User), &userData)
	if err != nil {
		http.Error(w, "Erreur lors du décodage JSON", http.StatusBadRequest)
		return
	}

	var response Response

	err = addPostToDb(data, userData)
	if err != nil {
		response.Error = "erreur to add post in db"
		response.Status = "erreur"
		http.Error(w, "Erreur for add post in db", http.StatusBadRequest)

		responseData, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(responseData)

		return
	}

	response.Status = "success"

	responseData, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)

}

func addPostToDb(post PostStruct, userData UserStruct) error {
	db, err := sql.Open("sqlite3", "./db/rtf.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	query := `INSERT INTO post_forum (user_id, categories, title, content, slug) VALUES (?, ?, ?, ?, ?)`
	_, err2 := db.Exec(query, userData.Id, post.Categorie, post.Title, post.Content, Slugify(post.Title))
	if err != nil || err2 != nil {
		log.Fatal("Failed to insert fake forum comment:", err)
	}
	return nil
}

func GetPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	allPost, err := GetPostsInDB()
	if err != nil {
		log.Fatal("Failed to get all Post in db:", err)
	}

	responseData, err := json.Marshal(allPost)
	if err != nil {
		http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)
}

func GetPostsInDB() ([]GetPostStruct, error) {
	db, err := sql.Open("sqlite3", "./db/rtf.db")
	if err != nil {
		return nil, err
	}
	defer db.Close()

	query := "SELECT pf.id, u.username, pf.categories, pf.title, pf.content, pf.creation_date, pf.slug FROM post_forum pf LEFT JOIN users u ON pf.user_id = u.id"
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var post []GetPostStruct
	for rows.Next() {
		var categorieStruct GetPostStruct
		if err := rows.Scan(&categorieStruct.Id, &categorieStruct.Username, &categorieStruct.Categorie,
			&categorieStruct.Title, &categorieStruct.Content, &categorieStruct.CreationDate, &categorieStruct.Slug); err != nil {
			return nil, err
		}
		post = append(post, categorieStruct)
	}

	return post, nil
}

func GetPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erreur de lecture du corps de la requête", http.StatusInternalServerError)
		return
	}

	var data IdStruct
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Erreur lors du décodage JSON", http.StatusBadRequest)
		return
	}

	post, _ := GetPostInDB(data)
	responseData, err := json.Marshal(post)
	if err != nil {
		http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)
}

func GetPostInDB(postId IdStruct) (GetPostStruct, error) {
	db, err := sql.Open("sqlite3", "./db/rtf.db")
	if err != nil {
		return GetPostStruct{}, err
	}
	defer db.Close()

	query := `
		SELECT 
			pf.id,
			u.username,
			pf.categories,
			pf.title,
			pf.content,
			pf.creation_date,
			pf.slug
		FROM 
			post_forum pf
		LEFT JOIN 
			users u ON pf.user_id = u.id
		WHERE pf.id = ?
		GROUP BY 
			pf.id
		LIMIT 1;`
	rows, err := db.Query(query, postId.ID)
	if err != nil {
		return GetPostStruct{}, err
	}
	defer rows.Close()

	var post GetPostStruct
	for rows.Next() {
		err := rows.Scan(
			&post.Id,
			&post.Username,
			&post.Categorie,
			&post.Title,
			&post.Content,
			&post.CreationDate,
			&post.Slug,
		)
		if err != nil {
			log.Fatal(err)
		}
	}

	return post, nil
}

func GetComments(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erreur de lecture du corps de la requête", http.StatusInternalServerError)
		return
	}

	var data IdStruct
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Erreur lors du décodage JSON", http.StatusBadRequest)
		return
	}

	comments, _ := GetCommentsInDB(data)
	responseData, err := json.Marshal(comments)
	if err != nil {
		http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)
}

func GetCommentsInDB(postId IdStruct) ([]CommentsStruct, error) {
	db, err := sql.Open("sqlite3", "./db/rtf.db")
	if err != nil {
		return []CommentsStruct{}, err
	}
	defer db.Close()

	query := `
		SELECT 
			fc.id,
			u.username,
			fc.content,
			fc.creation_date
		FROM 
			forum_comment fc
		LEFT JOIN 
			users u ON fc.user_id = u.id
		WHERE fc.post_id = ?
		GROUP BY 
			fc.id;`
	rows, err := db.Query(query, postId.ID)
	if err != nil {
		return []CommentsStruct{}, err
	}
	defer rows.Close()

	var comments []CommentsStruct
	for rows.Next() {
		var comment CommentsStruct
		if err := rows.Scan(&comment.Id, &comment.Username,
			&comment.Content, &comment.CreationDate); err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}

	return comments, nil
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erreur de lecture du corps de la requête", http.StatusInternalServerError)
		return
	}

	var data IdStruct
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Erreur lors du décodage JSON", http.StatusBadRequest)
		return
	}

	user, _ := GetUserInDbById(data)
	responseData, err := json.Marshal(user)
	if err != nil {
		http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)
}

func GetUserInDbById(id IdStruct) (UserStruct, error) {
	db, err := sql.Open("sqlite3", "./db/rtf.db")
	if err != nil {
		return UserStruct{}, err
	}
	defer db.Close()
	query := "SELECT id, username, first_name, last_name, gender, custom_gender, mail FROM users WHERE id = ?"
	rows, err := db.Query(query, id.ID)
	if err != nil {
		return UserStruct{}, err
	}
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

// ! Code to update is just a ctrl+c ctrl+v of AddNewPost
func AddNewComment(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erreur de lecture du corps de la requête", http.StatusInternalServerError)
		return
	}

	var data CommentsStructWithPostId
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Erreur lors du décodage JSON", http.StatusBadRequest)
		return
	}

	fmt.Println("data: ", data)

	var userData UserStruct
	err = json.Unmarshal([]byte(data.User), &userData)
	if err != nil {
		http.Error(w, "Erreur lors du décodage JSON", http.StatusBadRequest)
		return
	}

	var response Response

	err = addCommentToDb(data, userData)
	if err != nil {
		response.Error = "erreur to add post in db"
		response.Status = "erreur"
		http.Error(w, "Erreur for add post in db", http.StatusBadRequest)

		responseData, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(responseData)

		return
	}

	response.Status = "success"

	responseData, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)

}

func addCommentToDb(comment CommentsStructWithPostId, userData UserStruct) error {
	db, err := sql.Open("sqlite3", "./db/rtf.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	query := `INSERT INTO forum_comment (user_id, post_id, content) VALUES (?, ?, ?)`
	_, err2 := db.Exec(query, userData.Id, comment.PostId, comment.Content)
	if err != nil || err2 != nil {
		log.Fatal("Failed to insert fake forum comment:", err)
	}
	return nil
}

func GetUsersSocket(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	responseData, err := json.Marshal(usersList)
	if err != nil {
		http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)
}

func GetChatMessage(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erreur de lecture du corps de la requête", http.StatusInternalServerError)
		return
	}
	fmt.Println("body GetChatMessage: ", string(body))

	var data MessageRequest
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Erreur lors du décodage JSON", http.StatusBadRequest)
		return
	}

	chatMessages, err := fetchChatMessage(data)
	if err != nil {
		// Gérer l'erreur
		fmt.Println("Erreur lors de la récupération des messages:", err)
		return
	}

	fmt.Println("chatMessage: ", chatMessages)

	responseData, err := json.Marshal(chatMessages)
	if err != nil {
		http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)
}

func fetchChatMessage(data MessageRequest) ([]ChatMessage, error) {
	db, err := sql.Open("sqlite3", "./db/rtf.db")
	if err != nil {
		return []ChatMessage{}, err
	}
	defer db.Close()

	query := "SELECT * FROM chat_message WHERE (sender_user_id = ? AND receiver_user_id = ?) OR (sender_user_id = ? AND receiver_user_id = ?) ORDER BY date DESC LIMIT ? OFFSET ?"
	rows, err := db.Query(query, data.User1, data.User2, data.User2, data.User1, data.Limit, data.Offset)
	if err != nil {
		return []ChatMessage{}, err
	}
	defer rows.Close()

	var chat_messages []ChatMessage
	for rows.Next() {
		var chat_message ChatMessage
		if err = rows.Scan(&chat_message.ID, &chat_message.SenderUserID, &chat_message.ReceiverUserID, &chat_message.Message, &chat_message.Date); err != nil {
			return nil, err
		}
		chat_messages = append(chat_messages, chat_message)
	}

	return chat_messages, nil
}

func AddNewMessage(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erreur de lecture du corps de la requête", http.StatusInternalServerError)
		fmt.Println("1")
		return
	}
	fmt.Println(string(body))

	var data UserSendMessage
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Erreur lors du décodage JSON", http.StatusBadRequest)
		fmt.Println("2")
		return
	}

	var response Response

	err = addMessageToDb(data)
	if err != nil {
		fmt.Println("4")
		response.Error = "erreur to add message in db"
		response.Status = "erreur"
		http.Error(w, "Erreur for add message in db", http.StatusBadRequest)

		responseData, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(responseData)

		return
	}

	response.Status = "success"

	responseData, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)

}

func addMessageToDb(data UserSendMessage) error {
	fmt.Println("3")
	db, err := sql.Open("sqlite3", "./db/rtf.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	query := `INSERT INTO chat_message (sender_user_id, receiver_user_id, message) VALUES (?, ?, ?)`
	_, err2 := db.Exec(query, data.UserSendId, data.UserReceiveId, data.Message)
	if err != nil || err2 != nil {
		log.Fatal("Failed to insert fake forum comment:", err)
	}
	return nil
}

//* Get by last message with a user_id

func GetLastMessageByUserId(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erreur de lecture du corps de la requête", http.StatusInternalServerError)
		return
	}

	var data IdStruct
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Erreur lors du décodage JSON", http.StatusBadRequest)
		return
	}

	message, _ := fetchLastMessageByUserId(data)
	responseData, err := json.Marshal(message)
	if err != nil {
		http.Error(w, "Erreur lors de l'encodage JSON de la réponse", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)
}

func fetchLastMessageByUserId(id IdStruct) ([]ChatMessage, error) {
	db, err := sql.Open("sqlite3", "./db/rtf.db")
	if err != nil {
		return []ChatMessage{}, err
	}
	defer db.Close()
	query := `SELECT cm.id, cm.message, cm.sender_user_id, cm.receiver_user_id, cm.date
	FROM chat_message cm
	WHERE cm.id IN (
		SELECT MAX(id)
		FROM chat_message
		WHERE sender_user_id = ? OR receiver_user_id = ?
		GROUP BY
			CASE
				WHEN sender_user_id = ? THEN receiver_user_id
				ELSE sender_user_id
			END
	);`
	rows, err := db.Query(query, id.ID, id.ID, id.ID)
	if err != nil {
		return []ChatMessage{}, err
	}
	defer rows.Close()
	var allLastMessage []ChatMessage
	for rows.Next() {
		var lastChatMessage ChatMessage
		err := rows.Scan(&lastChatMessage.ID, &lastChatMessage.Message,
			&lastChatMessage.SenderUserID, &lastChatMessage.ReceiverUserID,
			&lastChatMessage.Date)
		if err != nil {
			return []ChatMessage{}, err
		}
		allLastMessage = append(allLastMessage, lastChatMessage)
	}
	return allLastMessage, nil
}
