import * as Constant from "../constant/constant.js";
import * as xhrRequest from "./xhrRequest.js";
import * as Alert from "./alerts.js";

export const socket = new WebSocket("ws://localhost:8080/ws");

let updateUserCooldown = false;
export async function AddUserToList() {
  if (updateUserCooldown) return;
  updateUserCooldown = true
  setTimeout(() =>{
    updateUserCooldown = false
  }, 10)
    xhrRequest.xhrRequest("POST", "/api/get/users/websocket").then( async (response) => {
    Constant.userList.innerHTML = ""
    
    let lastMessage = await getLastMessage();    
    
    response = JSON.parse(response);
    
    const userData = JSON.parse(localStorage.getItem("userData"))
    
    if (userData) { 
      response = response.filter(element => element.id !== userData.id);
      response.forEach(user => {
        if (lastMessage) {
          const lastMessageDate = trouverDernierMessage(user.id, lastMessage);
          if (lastMessageDate) {
              user.lastMessageDate = lastMessageDate;
          }else {
            user.lastMessageDate = null
          }
        }
      });
      console.log("🚀 ~ xhrRequest.xhrRequejhgfdst ~ reshgfdponse:", response)
    }else{
      response.forEach(user => {
        user.lastMessageDate = null
      })
    }
    
    response = response.filter(element => element.id !== 0);

    response.sort(customSort)    
    console.log("🚀 ~ xhrRequest.xhrRequejhgfdst ~ :", response)

    
    response.forEach((user) => {
      if (JSON.parse(localStorage.getItem("userData"))) {
        if (user.id != JSON.parse(localStorage.getItem("userData")).id) {
            Constant.userList.innerHTML += `<a href="#" class="list-group-item list-group-item-action border-0" id="user-list-chat" data-userid="${user.id}" data-username="${user.username}" data-status="${user.status}" style="margin: 2px 0 2px 2px;">
                <div class="d-flex align-items-start:)">
                    <img src="https://api.multiavatar.com/${user.username}.svg" class="rounded-circle mr-1" alt="William Harris" width="40" height="40">
                    <div class="flex-grow-1 ml-3">
                        ${user.username}
                        <div class="small"><span class="fas fa-circle"></span> ${user.status}</div>
                    </div>
                </div>
            </a>`;
          }
      }else{
        Constant.userList.innerHTML += `<a href="#" class="list-group-item list-group-item-action border-0" id="user-list-chat" data-userid="${user.id}" data-username="${user.username}" data-status="${user.status}" style="margin: 2px 0 2px 2px;">
                <div class="d-flex align-items-start">
                    <img src="https://api.multiavatar.com/${user.username}.svg" class="rounded-circle mr-1" alt="William Harris" width="40" height="40">
                    <div class="flex-grow-1 ml-3">
                        ${user.username}
                        <div class="small"><span class="fas fa-circle"></span> ${user.status}</div>
                    </div>
                </div>
            </a>`;
      }
    });
  });
}

async function getLastMessage() {
  if (!JSON.parse(localStorage.getItem("userData"))) return
  const data = { id: JSON.parse(localStorage.getItem("userData")).id.toString() };

  return new Promise((resolve, reject) => {
      xhrRequest.xhrRequest("POST", "/api/get/chat/message/last", data)
          .then(response => {
              response = JSON.parse(response);
              resolve(response);
          })
          .catch(error => {
              console.error("Error in getMessage:", error);
              reject(error);
          });
  });
}

function customSort(a, b) {
  if (b.lastMessageDate && a.lastMessageDate) {
      return b.lastMessageDate - a.lastMessageDate;
  } else if (b.lastMessageDate && !a.lastMessageDate) {
      return 1;
  } else if (!b.lastMessageDate && a.lastMessageDate) {
      return -1;
  }

  return a.username.localeCompare(b.username);
}

function trouverDernierMessage(userId, lastMessage) {
  const messages = lastMessage.filter(message => message.receiver_user_id === userId || message.sender_user_id === userId);
  if (messages.length > 0) {
      return Math.floor(new Date(messages[messages.length - 1].date).getTime() / 1000);
  } else {
      return null; // Aucun message trouvé
  }
}

export async function scrollToBottom() {
    var chatBox = Constant.chatMessageBox;
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  document.addEventListener("click", async function(e){
    const userChatTarget = e.target.closest("#user-list-chat");
    if (userChatTarget) {
        const children = userChatTarget.children;
        let isOnline = false;
        let isOffline = false;

        for (let i = 0; i < children.length; i++) {
            const childText = children[i].textContent.trim().toLowerCase();
            console.log(childText);
            if (childText.includes("online")) {
                isOnline = true;
            } else if (childText.includes("offline")) {
                isOffline = true;
            }
        }

        if (isOnline) {
            console.log("User is online");
        }
        if (isOffline) {
            console.log("User is offline");
        }

        startChatWithUser(userChatTarget)

    }
});

async function startChatWithUser(user) {
  const userWhoClic = JSON.parse(localStorage.getItem("userData"))
  
  if (!userWhoClic) {
    return
  }

  Constant.userChatSelect.innerText = user.dataset.username
  Constant.userChatStatus.innerText = user.dataset.status
  Constant.chatInputText.dataset.userReceive = user.dataset.userid
  Constant.userChatSelectPp.src = `https://api.multiavatar.com/${user.dataset.username}.svg`


  const messages = await getMessageChat(userWhoClic.id, user.dataset.userid, Constant.chatMessageBox.childElementCount, 10)
  console.log("🚀 ~ startChatWithUser ~ messages:", messages)

  showMessage(messages, userWhoClic, user.dataset.username, false, false)
  
  Constant.chatInputText.disabled = false;
  Constant.chatInputButton.disabled = false;
  scrollToBottom()
}


async function getMessageChat(SenderId, ReceiverID, offset, limit) {
  const data = { user1: SenderId.toString(), user2: ReceiverID.toString(), offset: offset, limit: limit };
  console.log("🚀 ~ getMessageChat ~ data:", data)
  return new Promise((resolve, reject) => {
      xhrRequest.xhrRequest("POST", "/api/get/chat/message", data)
          .then(response => {
              response = JSON.parse(response);
              resolve(response);
          })
          .catch(error => {
              console.error("Error in getMessage:", error);
              reject(error);
          });
  });
}

async function showMessage(messages, userWhoClic, userSelectUsername, isNew, isRevert){
  if (!isNew) {
    Constant.chatMessageBox.innerHTML = ""
  }else{
    await AddUserToList()
  }
  if (messages == null) {
    return
  }
  let allMessage = "";

  messages.reverse().forEach((message, index) => {
     let marginTop;
    if (index == 0) {
      marginTop = " mt-2"
    }

    if (userWhoClic.id == message.sender_user_id) {
      allMessage += `<div class="chat-message-right mb-4${marginTop}" style="margin-right: 5px;" data-postid=${message.id}>
      <div>
        <img src="https://api.multiavatar.com/${userWhoClic.username}.svg" class="rounded-circle mr-1" alt="${userWhoClic.username}" width="40" height="40">
        <div class="text-muted small text-nowrap mt-2">${convertDateFormat(message.date)}</div>
      </div>
      <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
        <div class="font-weight-bold mb-1"><b>${userWhoClic.username}</b></div>
        ${message.message}
      </div>
    </div>`
    }else{
      allMessage += `<div class="chat-message-left pb-4${marginTop}"  data-postid=${message.id}>
      <div>
        <img src="https://api.multiavatar.com/${userSelectUsername}.svg" class="rounded-circle mr-1" alt="${userSelectUsername}" width="40" height="40">
        <div class="text-muted small text-nowrap mt-2">${convertDateFormat(message.date)}</div>
      </div>
      <div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
        <div class="font-weight-bold mb-1"><b>${userSelectUsername}</b></div>
        ${message.message}
      </div>
    </div> `
    }
  });
  if (isRevert) {
    Constant.chatMessageBox.insertAdjacentHTML("afterbegin", allMessage);
  } else {
    Constant.chatMessageBox.insertAdjacentHTML("beforeend", allMessage);
    scrollToBottom()
  }
}

var scrollColldown = false


Constant.chatMessageBox.addEventListener('scroll', async function() {
  if (scrollColldown) {
    Alert.showAlert("danger", "cooldown", "scroll cooldown")
  }
  if (Constant.chatMessageBox.scrollTop === 0 && !scrollColldown) {
    console.log("L'utilisateur a atteint le haut du défilement.");
    
    const scrollPosition = Constant.chatMessageBox.scrollHeight - Constant.chatMessageBox.scrollTop;
    
    let userSend = JSON.parse(localStorage.getItem("userData"))
    const messages = await getMessageChat(userSend.id, Constant.chatInputText.dataset.userReceive, Constant.chatMessageBox.childElementCount, 10)
    
    if (messages == null) return;
    
      showMessage(messages, userSend, Constant.userSelectUsername.innerText, true, true);
  
      Constant.chatMessageBox.scrollTop = Constant.chatMessageBox.scrollHeight - scrollPosition;
  
      console.log("🚀 ~ Constant.chatMessageBox.addEventListener ~ messages:", messages)
      startCooldown()
    }
  });
  
  function startCooldown() {
    scrollColldown = true
    
    setTimeout(() => {
      console.log("dsklkfsdlkfjsdlkfj")
      scrollColldown = false
    }, 2000)
  }


function convertDateFormat(dateString) {
  var date = new Date(dateString);

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();

  var formattedDate = (day < 10 ? '0' : '') + day + '/' +
                      (month < 10 ? '0' : '') + month + '/' +
                      year + ' <br/> ' +
                      (hours < 10 ? '0' : '') + hours + ':' +
                      (minutes < 10 ? '0' : '') + minutes;

  return formattedDate;
}

Constant.chatInputButton.addEventListener("click", async function(e) {
  if (Constant.chatInputText.value != "") {
    let userReceiveId = Constant.chatInputText.dataset.userReceive
    let userSend = JSON.parse(localStorage.getItem("userData"))
    const data = {user_receive_id: userReceiveId, user_send_id: userSend.id.toString(), message: Constant.chatInputText.value, type:"message"}

    var date = new Date();

    await xhrRequest.xhrRequest("POST", "/api/send/chat/message", data)
    .then(response => {
        response = JSON.parse(response);
        console.log("🚀 ~ Constant.chatInputButton.addEventListener ~ response:", response)
        showMessage([{date: date, id:null, message: Constant.chatInputText.value, receiver_user_id: userReceiveId, sender_user_id: userSend.id}],
        userSend, Constant.userSelectUsername, true, false)

        socket.send(JSON.stringify(data))

        Constant.chatInputText.value = ""
        
        scrollToBottom()
    })
    .catch(error => {
        console.error("Error in getMessage:", error);
        reject(error);
    });
  }
})

export async function receiveMessageSocket(data){
  console.log("🚀 ~ receiveMessageSocket ~ data:", data)
    if (Constant.chatInputText.dataset.userReceive != undefined && Constant.chatInputText.dataset.userReceive == data.user_send_id) {
      let userSend = JSON.parse(localStorage.getItem("userData"))
      
      var date = new Date();

      showMessage([{date: date, id:null, message: data.message, receiver_user_id: data.user_receive_id, sender_user_id: data.user_send_id}],
        userSend, Constant.userSelectUsername.innerText, true, false)
    }else{
      console.log("socket recu: ", data);
      const userId = { id: data.user_send_id.toString() };
        await xhrRequest.xhrRequest("POST", "/api/get/user", userId)
        .then(response => {
            response = JSON.parse(response)
            if (response.id != 0) {
              Alert.showAlert("info", "New message !", `user ${response.username} send you a message`)
            }
        })

    }
        console.log("🚀 ~ receiveMessageSocket ~ Constant.userSelectUsername:", Constant.userSelectUsername)
        scrollToBottom()
}

let typingTimer; 
let isTypingSent = false;

Constant.chatInputText.addEventListener("keypress", function() {
  
  clearTimeout(typingTimer);

  let user = JSON.parse(localStorage.getItem("userData"))

  if (!isTypingSent) {
    socket.send(JSON.stringify({
      type: "isTyping",
      is_typing: true,
      who_typing_id: user.id,
      who_need_to_know: Constant.chatInputText.dataset.userReceive
    }));
    isTypingSent = true; 
  }

  typingTimer = setTimeout(function() {
    console.log("2 secondes écoulées sans appuyer sur une autre touche.");

    if (isTypingSent) {
      socket.send(JSON.stringify({
        type: "isTyping",
        is_typing: false,
        who_typing_id: user.id,
        who_need_to_know: Constant.chatInputText.dataset.userReceive
      }));
      isTypingSent = false;
    }
  }, 1000);
});


export function showUserIsTyping(data) {
  if (Constant.chatInputText.dataset.userReceive != undefined && Constant.chatInputText.dataset.userReceive == data.user_send_id) {
    if (data.is_typing) {
      Constant.userChatIsTyping.style.display = "inline"
    }else{
      Constant.userChatIsTyping.style.display = "none"
    }
  }
}