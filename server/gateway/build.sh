GOOS=linux go build

docker build -t lyons124/gateway .

docker push lyons124/gateway:latest

go clean