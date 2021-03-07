GOOS=linux go build

docker build -t lyons124/subscribe .

docker push lyons124/subscribe

go clean