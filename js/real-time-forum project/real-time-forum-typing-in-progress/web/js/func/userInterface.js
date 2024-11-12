import * as Constant from '../constant/constant.js'
import * as PostForm from './postForm.js'
import * as Chat from './chat.js'

export async function userConnected(user) {
    if (typeof(user) == "string") {
        user = JSON.parse(user)
      }
      
      //? Add Make Post Button
      const newLi = document.createElement("li");
      newLi.id = "makePost"
      
      if (!localStorage.getItem("userData")) {
        localStorage.setItem("userData", JSON.stringify(user));
      }

      console.log("🚀 ~ userConnected ~ user:", user)
    Chat.socket.send(JSON.stringify({id: user.id, username: user.username, status: 'online', type: 'connexion'}))
    const newA = document.createElement("a")
    newA.classList = "nav-link px-2";

    const textnode = document.createTextNode("Create a post");

    newLi.appendChild(newA);
    newA.appendChild(textnode)
    newA.id = "makePostButton"
    newA.style.cursor = "pointer"


    Constant.headerButton.appendChild(newLi)

    //? display none connexionButton and show user is log
    Constant.connexionButton.style.display = "none"

    const newDiv = document.createElement("div");
    newDiv.classList = "col-md-3 text-end dropdown"
    newDiv.id = "userIsLog"

    const newAOfDiv = document.createElement("a");
    newAOfDiv.classList = "d-block link-dark text-decoration-none dropdown-toggle show";
    //! à changer
    newAOfDiv.href = "Je/sais/toujours/pas";
    newAOfDiv.setAttribute('data-bs-toggle', 'dropdown');
    newAOfDiv.setAttribute('aria-expanded', 'true');

    const newImg = document.createElement("img");
    newImg.src = `https://api.multiavatar.com/${user.username}.svg`
    newImg.classList = "rounded-circle"
    newImg.style.width = "32px"
    newImg.style.height = "32px"
    
    newDiv.appendChild(newAOfDiv)
    newAOfDiv.appendChild(newImg)
    newAOfDiv.appendChild(document.createTextNode(` Hi ${user.username}!`))

    //? Add drop down for logout
    const newUl = document.createElement("url");
    newUl.classList = "dropdown-menu dropdown-menu-dark show"
    newUl.style.position = "absolute"
    newUl.style.inset = "0px auto auto 90px"
    newUl.style.margin = "0px"
    newUl.style.transform = "translate(0px, 34px)"

    //! faudra changer ça sent le cancer ici 
    const newLiOfUl = document.createElement("li");
    const newAOfLiOfUl = document.createElement("a");
    newAOfLiOfUl.classList = "dropdown-item"
    newAOfLiOfUl.appendChild(document.createTextNode("Log out"))
    newAOfLiOfUl.addEventListener("click", userLogout.bind(null, user));

    newLiOfUl.appendChild(newAOfLiOfUl)
    newUl.appendChild(newLiOfUl)
    newDiv.appendChild(newUl)
    
    Constant.header.appendChild(newDiv)
}

Constant.Home.addEventListener('click', hideFormPost)

export async function userLogout(user) {
    Chat.socket.send(JSON.stringify({id: user.id, username: user.username, status: 'offline', type: 'connexion'}))

    localStorage.removeItem("userData");
    document.getElementById("makePost").remove()
    document.getElementById("userIsLog").remove()
    Constant.connexionButton.style.display = "block"
}

export function showFormPost(categories){
    let categoriesForForm = "<option value='' selected>Choose...</option>";
    categories.forEach(categorie => {
        categoriesForForm += `<option value="${categorie.categories_name}">${categorie.categories_name}</option>`
    });
    console.log("🚀 ~ showFormPost ~ categorie:", categoriesForForm)
    const formHTML = `
    <div class="container">
    <form id="createNewPost" class="text-center" action="#">
        <div class="mb-3 row mx-auto">
            <div class="col-md-5 mx-auto">
            <label for="titlePost" class="form-label">Title</label>
            <input type="text" class="form-control" id="titlePost" value="" placeholder="My title" required>
            </div>
            <div class="col-md-3 mx-auto">
                <label for="categorie" class="form-label">Categorie</label>
                <select class="form-select" id="categorie" required="">
                    ${categoriesForForm}
                </select>
            </div>
        </div>
        <div class="mb-3 col-md-8 mx-auto">
            <label for="textContentPost" class="form-label">Content</label>
            <textarea class="form-control" id="textContentPost" rows="6" required></textarea>
        </div>
        <div class="buttonPost">
        <button type="submit" class="btn btn-primary">Connect</button>
        </div>
    </form>
    </div>
    `;

    Constant.formPost.innerHTML = formHTML;
    Constant.formPost.style.display = 'block'
    Constant.chat.style.display = 'none'
    Constant.postView.style.display = 'none'
    Constant.postDetail.style.display = 'none'
}

export function hideFormPost(){
    Constant.formPost.innerHTML = "";
    Constant.formPost.style.display = 'none'
    PostForm.getAllPost()
    Constant.chat.style.display = 'block'
    Constant.postView.style.display = 'block'
    Constant.postDetail.style.display = 'none'
}

export function showPostDetail(post, comments){

    let commentsHTML = ""

    let formHMTL = ` <form id='postComments' action='#'>
            <div class='row'>
            <div class='col-mb-3 mb-3'>
                <label for='commentInput' class='form-label'>Votre commenaire</label>
                <input type='text' class='form-control' id='commentInput' required>
            </div>
                <input type='text' value='${post.id}' id="postId" hidden required>
            </div>
            <div>
                <button type='submit' class='btn btn-primary'>valider</button>
            </div>
        </form>`

    if (comments) {
        comments.forEach(comment => {
            commentsHTML += `<div>
              <hr />
              <a class='h4'>Commentaire de ${comment.username}</a>
              <div class='d-flex align-items-center comment-post'>
                <div style='margin-left: 1em' class='flex-grow-1 overflow-auto'>
                  <p>
                    <span class='op-6 font-weight-bold'>Posté </span>${comment.creation_date}
                  </p>
                  <div class='text-sm op-5 content-post'>
                    <p>
                      ${comment.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>`
        });
    }

    Constant.postDetail.innerHTML = ""

    Constant.formPost.style.display = 'none'
    Constant.chat.style.display = 'none'
    Constant.postView.style.display = 'none'
    Constant.postDetail.style.display = 'block'

    const postHTML = `<div class='container mt-3 text-center'>
    <div class='row'>
      <div class='col-lg-12 mb-3'>
        <div
          class='card row-hover pos-relative py-3 px-3 mb-3'
        >
          <div class='row align-items-center'>
            <div class='col-md-12 mb-1 mb-sm-0'>
              <h5>
                <a href='#' class='text-primary'
                  >${post.title}</a
                >
              </h5>
              <p class='text-sm'>
                <span class='op-6 font-weight-bold'>Posté </span>
                <a class='text-black' href='#'>${post.creation_date}</a>
                <span class='op-6 font-weight-bold'>par</span>
                <a class='text-black' href='#'
                  >${post.username}</a
                >
              </p>
              <hr />
              <div class='text-sm op-5 content-post'>
                <p>
                    ${post.content}
                </p>
              </div>
            </div>
            <h3>Ajouter un commentaire</h3>
            ${formHMTL}
            <h3>Liste des commentaires</h3>
            <div id="commentsSecction">
              ${commentsHTML}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`
    Constant.postDetail.innerHTML = postHTML
}

export function showAllPosts(posts) {
    console.log("🚀 ~ showAllPosts ~ posts:", posts)

    let postsHTML = "";

    if (posts === null) return;

    posts.forEach((post, index) => {
        if (index % 4 === 0) {
            postsHTML += `<div class="row mb-2">`;
        }

        postsHTML += `<div class='col-md-3'>
            <div class='card' id="postFeed" data-post-id="${post.id}" style='width: 18rem; cursor: pointer;'>
                <div class='card-body'>
                    <h5 class='card-title'>${post.title}</h5>
                    <h6 class='card-subtitle mb-2 text-body-secondary'>par ${post.username}</br>Le ${post.creation_date}</h6>
                    <p class='card-text'>${post.content}</p>
                    <span>Catégorie: <code class="card-link disabled text-decoration-none text-dark">${post.categorie}</code></span>
                </div>
            </div>
        </div>`;

        if ((index + 1) % 4 === 0 || index === posts.length - 1) {
            postsHTML += `</div>`;
        }
    });
    
    Constant.postView.innerHTML = ""
    Constant.postView.innerHTML = postsHTML
}
