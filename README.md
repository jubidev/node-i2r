# node-i2r

This microservice can be used to convert impulse readings, received from an mqtt topic, to a stock reading which then gets published to another mqtt topic. 
Example: A gas counter might pulse / send a signal every time a counter traverses the 0. To get the stock of the counter one could either implement the tracking of the stock onto the counter senser itself or outsource it into a service like node-i2r.
The stock reading can be set via a simple web interface and is persistent across reboots or container changes.

## Commands to work with this project

### Prerequisites

Both of these tools have to be installed

* Docker
* git

### Get the project

    git clone https://github.com/jubidev/node-i2r.git

### Build the docker image

    docker build -t node-i2r .

### Create a stock file for persistence

    touch stock.txt

### Start the container

Parameters for mqtt settings, the exposed port and the path to the stock file should be adjusted.

    docker run -d -v ./stock.txt:/app/stock.txt --restart unless-stopped -p 3000:3000 --name node-i2r-gascounter -e MQTT_USERNAME=REPLACE_ME -e MQTT_PASSWORD=REPLACE_ME -e MQTT_BROKER=REPLACE_ME -e MQTT_IMPULSE_TOPIC=REPLACE_ME -e MQTT_STOCK_TOPIC=REPLACE_ME node-i2r