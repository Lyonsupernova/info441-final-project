GOOS=linux go build

docker build -t #TODO/gateway .

docker push #TODO/gateway:latest

go clean