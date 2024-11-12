package server

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

func InitServer() {

	db, err := InitDB()
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	fmt.Printf("[%s] Successfully connected to the database.\n", time.Now().Format("2006-01-02 15:04:05"))
	defer db.Close()

	//* fetch all users on start
	query := "SELECT id, username FROM users"
	rows, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		var user UserConnection
		err := rows.Scan(&user.Id, &user.Username)
		if err != nil {
			log.Fatal(err)
		}
		user.Status = "offline"
		usersList = append(usersList, user)
	}
	fmt.Println("start server userCheck", usersList)

	// Perform a simple query to verify the connection
	var version string
	err = db.QueryRow("SELECT sqlite_version()").Scan(&version)
	if err != nil {
		fmt.Println("Error querying database:", err)
		return
	}
	fmt.Println("SQLite Version:", version)

	http.Handle("/web/", http.StripPrefix("/web/", http.FileServer(http.Dir("web"))))
	http.HandleFunc("/", HomeHandler)
	http.HandleFunc("/api/register", Register)
	http.HandleFunc("/api/login", Login)
	http.HandleFunc("/api/get/categorie", GetAllCategorie)
	http.HandleFunc("/api/post/form", AddNewPost)
	http.HandleFunc("/api/post/comment", AddNewComment)
	http.HandleFunc("/api/get/allpost", GetPosts)
	http.HandleFunc("/api/get/post", GetPost)
	http.HandleFunc("/api/get/comments", GetComments)
	http.HandleFunc("/api/get/user", GetUser)
	http.HandleFunc("/api/get/users/websocket", GetUsersSocket)
	http.HandleFunc("/api/get/chat/message", GetChatMessage)
	http.HandleFunc("/api/send/chat/message", AddNewMessage)
	http.HandleFunc("/api/get/chat/message/last", GetLastMessageByUserId)
	http.HandleFunc("/ws", WsEndpoint)

	log.Println("Starting server on http://127.0.0.1:8080")

	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
