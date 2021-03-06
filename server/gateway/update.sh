# repull all containers
#docker network rm info441
#docker network create info441

docker rm -f redis
docker run -d --name redis --network info441 redis

docker rm -f gateway
docker pull lyons124/gateway:latest

docker rm -f 441mysql
docker pull lyons124/441mysql

# export all environment variables
export TLSCERT=/etc/letsencrypt/live/api.stockstation.gay/fullchain.pem
export TLSKEY=/etc/letsencrypt/live/api.stockstation.gay/privkey.pem
export SESSIONKEY=$(openssl rand -base64 18)
export MYSQL_ROOT_PASSWORD=$(openssl rand -base64 18)
export DB_NAME=441sqlserver
export REDISADDR=redis:6379
export SUBSCRIPTION=subscribe:80
export PRODUCT=product:80

# running mysql instance
docker run -d \
    -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
    -e MYSQL_DATABASE=$DB_NAME \
    --name 441mysql \
	  --network info441 \
    lyons124/441mysql

export DSN=root:$MYSQL_ROOT_PASSWORD@tcp\(441mysql:3306\)/$DB_NAME

# running gateway
docker run -d \
  --name gateway \
  -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  -e TLSCERT=$TLSCERT \
  -e TLSKEY=$TLSKEY \
  -e ADDR=:443 \
  -e SESSIONKEY=$SESSIONKEY \
  -e DSN=$DSN \
  -e REDISADDR=$REDISADDR \
  -e PRODUCT=$PRODUCT \
  -e SUBSCRIPTION=$SUBSCRIPTION \
  --network info441 \
  lyons124/gateway:latest

exit