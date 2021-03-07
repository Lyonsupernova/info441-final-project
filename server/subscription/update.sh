docker pull lyons124/subscribe

docker rm -f subscribe

export MONGOADDR="mongodb://info441MongoDB:27017/subscribe"


# running messaging instance
docker run -d \
    -e PORT=80 \
    -e MONGOADDR=$MONGOADDR \
    --name subscribe \
	--network info441 \
    lyons124/subscribe

