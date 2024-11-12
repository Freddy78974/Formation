import * as Alert from './alerts.js'
import * as UserInterface from './userInterface.js'
import * as Constant from '../constant/constant.js'
import * as xhrRequest from './xhrRequest.js'
import * as Chat from './chat.js'

export let userConnected = [];

Constant.registerGenderForm.addEventListener("change", function() {
    if(Constant.registerGenderForm.value == "Custom"){
        Constant.registerGenderForm.parentElement.classList.remove("col-md-6")
        Constant.registerGenderForm.parentElement.classList.add("col-md-4")
        Constant.registerAgeForm.parentElement.classList.remove("col-md-6")
        Constant.registerAgeForm.parentElement.classList.add("col-md-3")
        Constant.registerCustomGenderForm.style.display = "block"
        Constant.registerCustomGenderinput.required = true;
    }else{
        Constant.registerGenderForm.parentElement.classList.add("col-md-6")
        Constant.registerGenderForm.parentElement.classList.remove("col-md-4")
        Constant.registerAgeForm.parentElement.classList.add("col-md-6")
        Constant.registerAgeForm.parentElement.classList.remove("col-md-3")
        Constant.registerCustomGenderForm.style.display = "none"
        Constant.registerCustomGenderinput.required = false;
    }
})

function validateLoginForm() {
    if (!Constant.loginInputEmailLoginForm.value || !Constant.loginInputPasswordLoginForm.value) {
        Alert.showAlert("warning", "Attention !", "Veuillez remplir tous les champs");
        return false;
    }
    return true;
}

function validateRegisterForm() {
    if (Constant.registerGenderForm.value == "Custom" && !Constant.registerCustomGenderinput.value) {
        Alert.showAlert("warning", "Attention !", "Veuillez remplir le champ de genre personnalisé");
        return false;
    }
    if (!Constant.registerFirstNameForm.value || !Constant.registerLastNameForm.value || !Constant.registerInputUsernameForm.value ||
        !Constant.registerGenderForm.value || !Constant.registerAgeForm.value || !Constant.registerInputEmailForm.value ||
        !Constant.registerInputPasswordForm.value || !Constant.registerInputPasswordConfirmForm.value) {
        Alert.showAlert("warning", "Attention !", "Veuillez remplir tous les champs");
        return false;
    }
    if (Constant.registerInputPasswordForm.value != Constant.registerInputPasswordConfirmForm.value) {
        Alert.showAlert("warning", "Attention !", "Vous n'avez pas rentré le même mot de passe");
        return false;
    }
    return true;
}

Constant.loginForm.addEventListener("submit", async function(event) {
    if (!validateLoginForm()) {
        event.preventDefault();
    }else{
        let userLogin = {
            'email': Constant.loginInputEmailLoginForm.value,
            'password': Constant.loginInputPasswordLoginForm.value,
        }

        
        await xhrRequest.xhrRequest("POST", "/api/login", userLogin)
            .then(response => {
                response = JSON.parse(response)
                if (response.Status == 'error') {
                    Alert.showAlert("danger", "Erreur !", "Il semble que aucun compte n'existe avec cet e-mail ou que le mot de passe n'est pas correct.");
                    return
                }

                console.log(response.User.id)

                Alert.showAlert("success", `Bienvenue ${response.User.username} !`, "Connexion reussie");
                userConnected.push(response)

                UserInterface.userConnected(response.User)

                closeModal(Constant.loginModal)

                console.log("🚀 ~ Constant.loginForm.addEventListener ~ response:", response)
                window.location.reload()
            })
    }
});

Constant.registerForm.addEventListener("submit", async function(event) {
    if (!validateRegisterForm()) {
        event.preventDefault();
    }else{
        let userRegistration = {
            'firstName': Constant.registerFirstNameForm.value,
            'lastName': Constant.registerLastNameForm.value,
            'username': Constant.registerInputUsernameForm.value,
            'gender': Constant.registerGenderForm.value,
            'age': Constant.registerAgeForm.value,
            'genderCustom': Constant.registerCustomGenderinput.value,
            'email': Constant.registerInputEmailForm.value,
            'password': Constant.registerInputPasswordForm.value,
        }
        await xhrRequest.xhrRequest("POST", "/api/register", userRegistration)
            .then(response => {
                response = JSON.parse(response)
                console.log("🚀 ~ Constant.registerForm.addEventListener ~ response:", response)

                if (response.Status == 'error') {
                    Alert.showAlert("danger", "Erreur !", response.Error);
                    return
                }
                
                Alert.showAlert("success", `Bienvenue ${response.User.username} !`, "Votre inscription a bien été validée. Vous pouvez maintenant vous connecter pour accéder au chat.");
                
                Chat.socket.send(JSON.stringify({id: response.User.id, username: response.User.username, status: "offline", type: 'connexion'}))
                
                closeModal(Constant.registerModal)
                window.location.reload()
            })
    }
});

function closeModal(element) {
    element.classList.remove('show');
    element.style.display = 'none';
    document.getElementsByClassName('modal-backdrop')[0].remove();
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
}