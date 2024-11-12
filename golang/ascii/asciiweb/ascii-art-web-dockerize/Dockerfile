FROM golang:latest

# Destiantion pour tout les fichier importés 
WORKDIR /app

# Copie du go.mod 
COPY go.mod .
RUN go mod download

# Copie du fichier dockerize contenant tout les codes
COPY . .

# Chemin et nom de dossier pour le build
RUN go build -o /web ./web/main.go 

# Port choisis pour le programme 
EXPOSE 8080

# Commande a saisir pour l'execution
CMD ["/web"]

LABEL author="cescriva, njeanfre et ldelamare"