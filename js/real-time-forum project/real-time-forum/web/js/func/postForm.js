import * as Constant from '../constant/constant.js'
import * as userInterface from './userInterface.js'
import * as xhrRequest from './xhrRequest.js'
import * as Alert from './alerts.js'

//* Check if the clicked button is makePostButton or postFeed
document.addEventListener("click", async function(e){
    const makePostButton = e.target.closest("#makePostButton");
    const postFeed = e.target.closest("#postFeed");
  
    if(makePostButton){
      xhrRequest.xhrRequest("POST", "/api/get/categorie")
            .then(response => {
                response = JSON.parse(response)
                userInterface.showFormPost(response)
            })
    }else if(postFeed){
        const postId = postFeed.getAttribute("data-post-id")
        let post = await getPost(postId)
        let comments = await getCommentOfPost(postId)
        userInterface.showPostDetail(post, comments)
    }
});

//* Check if the form createNewPost is submit
document.addEventListener("submit", function(e){
    const makePostButton = e.target.closest("#createNewPost");
    const postComments = e.target.closest("#postComments");
    let dataToSend = []
    if(makePostButton){
        let user = localStorage.getItem("userData")
        if (checkPostFormFild()) {
            dataToSend = {
                'title': document.getElementById('titlePost').value,
                'content': document.getElementById('textContentPost').value ,
                'categorie': document.getElementById('categorie').value ,
                'user' : user
            }
            xhrRequest.xhrRequest("POST", "/api/post/form", dataToSend)
            .then(response => {
                response = JSON.parse(response)
                if (response.Status == "erreur") {
                    console.log("🚀 ~ document.addEventListener ~ response:", response)
                    Alert.showAlert("danger", "Erreur !", "Le post ne s'est pas envoyé correctement.");
                }
                Alert.showAlert("success", "Bravo !", "Votre post a bien été envoyé au serveur.");
                userInterface.hideFormPost()
            })
        }
    }else if(postComments){
        console.log(postComments);
        if (checkCommentFormFild()){
            //! add comments to db and print to user
            let user = localStorage.getItem("userData")
            dataToSend = {
                'content': document.getElementById('commentInput').value ,
                'postid': document.getElementById('postId').value ,
                'user' : user
            }
            user = JSON.parse(user)
            xhrRequest.xhrRequest("POST", "/api/post/comment", dataToSend)
            .then(response => {
                response = JSON.parse(response)
                if (response.Status == "erreur") {
                    Alert.showAlert("danger", "Erreur !", "Le commentaire ne s'est pas envoyé correctement.");
                }
                Alert.showAlert("success", "Bravo !", "Votre commentaire a bien été envoyé au serveur.");
                document.getElementById('commentInput').value = ""
                const date = new Date(); 
                const formattedDate = date.toISOString(); 
                let commentHTML = `<div>
                <hr />
                <a class='h4'>Commentaire de ${user.username}</a>
                <div class='d-flex align-items-center comment-post'>
                  <div style='margin-left: 1em' class='flex-grow-1 overflow-auto'>
                    <p>
                      <span class='op-6 font-weight-bold'>Posté </span>${formattedDate}
                    </p>
                    <div class='text-sm op-5 content-post'>
                      <p>
                        ${dataToSend.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>`

                document.getElementById('commentsSecction').innerHTML += commentHTML
                console.log("🚀 ~ document.addEventListener ~ response:", response)
            })
        }
    }
});

function checkPostFormFild() {
    if (!document.getElementById('titlePost').value || !document.getElementById('categorie').value ||
        !document.getElementById('textContentPost').value) {
        Alert.showAlert("warning", "Attention !", "Veuillez remplir tous les champs");
        return false;
    }
    return true;
}

function checkCommentFormFild() {
    if (!document.getElementById('commentInput').value || !document.getElementById('postId').value) {
        Alert.showAlert("warning", "Attention !", "Veuillez remplir tous les champs");
        return false;
    }
    return true;
}

export function getAllPost() {
    xhrRequest.xhrRequest("POST", "/api/get/allpost")
            .then(response => {
                response = JSON.parse(response)
                userInterface.showAllPosts(response)
            })
}

export function getPost(id) {
    console.log(id);
    const data = { id: id.toString() };
    return new Promise((resolve, reject) => {
        xhrRequest.xhrRequest("POST", "/api/get/post", data)
            .then(response => {
                response = JSON.parse(response);
                resolve(response);
            })
            .catch(error => {
                console.error("Error in getPost:", error);
                reject(error);
            });
    });
}

export function getCommentOfPost(id) {
    console.log(id);
    const data = { id: id.toString() };
    return new Promise((resolve, reject) => {
        xhrRequest.xhrRequest("POST", "/api/get/comments", data)
            .then(response => {
                response = JSON.parse(response);
                resolve(response);
            })
            .catch(error => {
                console.error("Error in getCommentOfPost:", error);
                reject(error);
            });
    });
}
