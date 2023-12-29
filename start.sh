#!/bin/sh

set -e

#create stock.txt if not already exists
file_path="stock.txt"

# Check if the file exists
if [ ! -e "$file_path" ]; then
    echo "File does not exist. Creating it."
    echo "0" > "$file_path"
else
    echo "File already exists."
fi

#format like mqtt://test.mosquitto.com:1883
MQTT_BROKER=

MQTT_USERNAME=
MQTT_PASSWORD=

MQTT_IMPULSE_TOPIC=
MQTT_STOCK_TOPIC=

docker run -d -v ./stock.txt:/app/stock.txt --restart unless-stopped -p 127.0.0.1:3000:3000 --name node-i2r-gascounter -e MQTT_USERNAME=$MQTT_USERNAME -e MQTT_PASSWORD=$MQTT_PASSWORD -e MQTT_BROKER=$MQTT_BROKER -e MQTT_IMPULSE_TOPIC=$MQTT_IMPULSE_TOPIC -e MQTT_STOCK_TOPIC=$MQTT_STOCK_TOPIC node-i2r

