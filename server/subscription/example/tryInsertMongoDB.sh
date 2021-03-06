db.product.insertOne({"productName": "Sony - PlayStation 5 Console", "productLink": "https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149"})
db.product.insertOne({"productName": "Apple - AirPods Pro - White", "productLink": "https://www.bestbuy.com/site/apple-airpods-pro-white/5706659.p?skuId=5706659"})
db.product.insertOne({"productName": "MacBook Air", "productLink": "https://www.bestbuy.com/site/macbook-air-13-3-laptop-apple-m1-chip-8gb-memory-256gb-ssd-latest-model-gold/6418599.p?skuId=6418599"})
db.product.insertOne({"productName": "DJI FPV Drone Combo", "productLink": "https://www.bestbuy.com/site/dji-fpv-drone-combo-with-remote-controller-and-goggles/6442031.p?skuId=6442031"})
db.product.insertOne({"productName": "Apple - iPhone SE", "productLink": "https://www.bestbuy.com/site/apple-iphone-se-2nd-generation-64gb-unlocked-white/6389070.p?skuId=6389070"})


docker run -d \
    -p 27017:27017 \
    --name info441MongoDB \
    mongo