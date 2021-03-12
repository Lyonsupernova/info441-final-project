sh build.sh

docker push lyons124/client:latest

ssh ec2-user@stockstation.gay < update.sh
