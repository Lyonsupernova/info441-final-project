docker pull lyons124/product

docker rm -f product

export MONGOADDR="mongodb://info441MongoDB:27017/subscribe"

docker run -d \
    -e PORT=80 \
    -e MONGOADDR=$MONGOADDR \
    --name product \
	  --network info441 \
    lyons124/product

