sudo docker image build -f Dockerfile -t web .

docker container run -p 8080:8080 --detach --name web web

echo "http://localhost:8080"