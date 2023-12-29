#!/bin/sh

set -e

#create stock.txt if not already exists
STOCK_FILE="/opt/node-i2r/stock.txt"

#format like mqtt://test.mosquitto.com:1883
MQTT_BROKER=

MQTT_USERNAME=
MQTT_PASSWORD=

MQTT_IMPULSE_TOPIC=
MQTT_STOCK_TOPIC=

CONTAINER_NAME=

# check if the file exists
if [ ! -e "$STOCK_FILE" ]; then
    echo "File does not exist. Creating it."
    echo "0" > "$STOCK_FILE"
else
    echo "File already exists."
fi

# start the docker container
docker run -d -v $STOCK_FILE:/app/stock.txt --restart unless-stopped -p 127.0.0.1:3000:3000 --name $CONTAINER_NAME -e MQTT_USERNAME=$MQTT_USERNAME -e MQTT_PASSWORD=$MQTT_PASSWORD -e MQTT_BROKER=$MQTT_BROKER -e MQTT_IMPULSE_TOPIC=$MQTT_IMPULSE_TOPIC -e MQTT_STOCK_TOPIC=$MQTT_STOCK_TOPIC node-i2r

