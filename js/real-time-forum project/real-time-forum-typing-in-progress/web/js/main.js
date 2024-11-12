import * as Auth from './func/auth.js'
import * as Chat from './func/chat.js'
import * as UserInterface from './func/userInterface.js'
import * as postForm from './func/postForm.js'
import * as xhrRequest from './func/xhrRequest.js'

Chat.socket.onopen = async () => {

    if (localStorage.getItem("userData")) {
            let user = JSON.parse(localStorage.getItem("userData"))
            const data = { id: user.id.toString() };
            await xhrRequest.xhrRequest("POST", "/api/get/user", data)
            .then(response => {
                response = JSON.parse(response)
                console.log("🚀 ~ Chat.socket.onopen= ~ response:", response)
                if (response.id == 0) {
                    localStorage.removeItem("userData")
                }else{
                    UserInterface.userConnected(localStorage.getItem("userData"))
                    
                    Chat.socket.send(JSON.stringify({id: user.id, username: user.username, status: 'online', type: 'connexion'}))
                    
                }
            })
    }else{
        Chat.socket.send("New Connection")
    }
    await Chat.AddUserToList()
}

// window.onclose()
// Chat.socket.onclose = () => {
//     Chat.socket.send(JSON.stringify({id: userConnected.User.id, username: userConnected.User.username, status: 'offline', type: 'connexion'}))
//     console.log("déco")
// };

Chat.socket.onmessage = (event) => {
    console.log("Message reçu:", event.data);
    if (event.data == "Update User") {
        Chat.AddUserToList()
    }else if (event.data.includes("message")) {        
        Chat.receiveMessageSocket(JSON.parse(event.data))
    }else {
        Chat.showUserIsTyping(JSON.parse(event.data))
    }
};


postForm.getAllPost()

Chat.scrollToBottom()

console.log("Hello World!")