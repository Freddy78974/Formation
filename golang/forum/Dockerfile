FROM golang:latest

# Destiantion pour tout les fichier importés 
WORKDIR /app

# Copie du go.mod 
COPY go.mod .
COPY go.sum .
RUN go mod download

# Copie du fichier dockerize contenant tout les codes
COPY . .

# Chemin et nom de dossier pour le build
RUN go build -o /main ./main.go 

# Port choisis pour le programme 
EXPOSE 8080

# Commande a saisir pour l'execution
CMD ["/main"]

# PROCÉDURE DE DÉMARRAGE:


# créer l'image docker à partir du terminal: 
# - sudo docker image build -f Dockerfile -t forum .

# créer l'image docker à partir du terminal:
# - docker container run -p 8080:8080 --detach --name web forum

# Arrêt du docker: 
# - Docker stop web

# Démarrage du docker:
# - Docker start web

# Effacé le docker:
# - Docker rm web

# Effacer l’image:
# - Docker rmi forum