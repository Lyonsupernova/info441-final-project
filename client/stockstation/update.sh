docker rm -f client
docker pull lyons124/client:latest


docker run -d \
--name client \
-p 443:443 \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
lyons124/client:latest

exit