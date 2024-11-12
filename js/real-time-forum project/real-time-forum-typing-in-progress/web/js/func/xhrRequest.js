export function xhrRequest(method, route, objToSend) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method, route, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.statusText);
                }
            }
        };

        xhr.onerror = function () {
            reject("Une erreur s'est produite lors de l'envoi de la requête.");
        };
        
        if (objToSend) {
            xhr.send(JSON.stringify(objToSend));
        } else {
            xhr.send();
        }
    });
}
