import * as Constant from '../constant/constant.js'

export function showAlert(alertType, messageTitle, message) {
    Constant.alertMainPage.innerHTML = ""
    Constant.alertMainPage.innerHTML = `<div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
            <strong>${messageTitle}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`

    setTimeout(() => {
        Constant.alertMainPage.innerHTML = ""
    }, 3000);
}
