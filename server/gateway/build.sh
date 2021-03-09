GOOS=linux go build

docker build -t lyons124/finalGateway .

docker push lyons124/finalGateway:latest

go clean