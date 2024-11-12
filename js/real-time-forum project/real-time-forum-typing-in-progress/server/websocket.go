package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Connection struct {
	conn *websocket.Conn
}

var (
	connections = make(map[*websocket.Conn]Connection)
	broadcast   = make(chan Message)
)

type Message struct {
	Sender  *websocket.Conn
	Content string
}

type UserConnection struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	Status   string `json:"status"`
	SocketId Connection
}

type UserTyping struct {
	Type          string `json:"type"`
	IsTyping      bool   `json:"is_typing"`
	WhoTypingId   int    `json:"who_typing_id"`
	WhoNeedToKnow string `json:"who_need_to_know"`
}

var usersList []UserConnection

func reader(conn *websocket.Conn) {
	for {
		_, p, err := conn.ReadMessage()

		if err != nil {
			log.Println(err)
			delete(connections, conn)
			return
		}
		log.Println("message socket: ", string(p))
		log.Println("connections[conn]: ", connections[conn])

		if string(p) == "New Connection" {
			return
		}
		fmt.Println("var p:", p)
		if strings.Contains(string(p), `"type":"connexion"`) {
			var newUser UserConnection
			err = json.Unmarshal(p, &newUser)
			if err != nil {
				log.Fatalln("err: ", err)
				return
			}
			newUser.SocketId = connections[conn]

			var userExists bool
			for i, existingUser := range usersList {
				if existingUser.Id == newUser.Id {
					usersList[i].Status = newUser.Status
					userExists = true
					usersList[i].SocketId = connections[conn]
					break
				}
			}

			if !userExists {
				usersList = append(usersList, newUser)
			}

			broadcast <- Message{Sender: conn, Content: string("Update User")}

		} else if strings.Contains(string(p), `"type":"message"`) {
			var message UserSendMessage

			err = json.Unmarshal(p, &message)
			if err != nil {
				log.Fatalln("err: ", err)
				return
			}

			fmt.Println(string(p))

			userReceiveID, err := strconv.Atoi(message.UserReceiveId)
			if err != nil {
				log.Println("Error converting UserReceiveId to int:", err)
				return
			}

			userSendId, err := strconv.Atoi(message.UserSendId)
			if err != nil {
				log.Println("Error converting UserReceiveId to int:", err)
				return
			}

			SendMessageToUser(userSendId, userReceiveID, message.Message)
		} else if strings.Contains(string(p), `"type":"isTyping"`) {
			fmt.Println("user typing")
			var userTyping UserTyping

			err = json.Unmarshal(p, &userTyping)
			if err != nil {
				log.Fatalln("err: ", err)
				return
			}

			WhoNeedToKnow, err := strconv.Atoi(userTyping.WhoNeedToKnow)
			if err != nil {
				log.Println("Error converting UserReceiveId to int:", err)
				return
			}

			if userTyping.IsTyping {
				SendTypingToUser(userTyping.WhoTypingId, WhoNeedToKnow, true)
			} else {
				SendTypingToUser(userTyping.WhoTypingId, WhoNeedToKnow, false)
			}
		}

		fmt.Println("reader: users: ", usersList)
	}
}

func WsEndpoint(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}
	log.Println("Connexion ok!")
	conn := Connection{conn: ws}
	connections[ws] = conn

	fmt.Println("WsEndpoint: users: ", usersList)
	go reader(ws)
}

func HandleMessages() {
	for {
		message := <-broadcast
		for conn := range connections {
			if conn != message.Sender {
				if err := conn.WriteMessage(websocket.TextMessage, []byte(message.Content)); err != nil {
					log.Println("Erreur lors de l'envoi du message:", err)
					delete(connections, conn)
				}
			}
		}
	}
}

func SendMessageToUser(userSendId int, userReceiveId int, messageContent string) {
	for _, user := range usersList {
		if user.Id == userReceiveId {
			targetConn := user.SocketId.conn
			response := map[string]interface{}{
				"user_receive_id": userReceiveId,
				"user_send_id":    userSendId,
				"message":         messageContent,
			}
			jsonResponse, err := json.Marshal(response)
			if err != nil {
				log.Println("Erreur lors de la conversion de la réponse en JSON:", err)
				return
			}
			if targetConn != nil {
				if err := targetConn.WriteMessage(websocket.TextMessage, []byte(jsonResponse)); err != nil {
					log.Println("Erreur lors de l'envoi du message:", err)
				}
			} else {
				log.Println("Erreur: La connexion WebSocket de l'utilisateur est nulle.")
			}
			return // Sortie de la fonction après avoir envoyé le message au destinataire
		}
	}
	log.Println("Erreur: Utilisateur non trouvé avec l'ID spécifié.")
}

func SendTypingToUser(userSendId int, userReceiveId int, isTyping bool) {
	for _, user := range usersList {
		if user.Id == userReceiveId {
			var send UserConnection
			for _, sender := range usersList {
				if sender.Id == userSendId {
					send = sender
					break
				}
			}
			targetConn := user.SocketId.conn
			response := map[string]interface{}{
				"user_receive_id": userReceiveId,
				"user_send_id":    userSendId,
				"is_typing":       isTyping,
				"user_name":       send.Username,
			}
			jsonResponse, err := json.Marshal(response)
			if err != nil {
				log.Println("Erreur lors de la conversion de la réponse en JSON:", err)
				return
			}
			if targetConn != nil {
				if err := targetConn.WriteMessage(websocket.TextMessage, []byte(jsonResponse)); err != nil {
					log.Println("Erreur lors de l'envoi du message:", err)
				}
			} else {
				log.Println("Erreur: La connexion WebSocket de l'utilisateur est nulle.")
			}
			return // Sortie de la fonction après avoir envoyé le message au destinataire
		}

	}
	log.Println("Erreur: Utilisateur non trouvé avec l'ID spécifié.")
}
