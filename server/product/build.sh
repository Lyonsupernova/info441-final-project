GOOS=linux go build

docker build -t lyons124/product .

docker push lyons124/product

go clean