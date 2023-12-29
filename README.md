# node-i2r

This microservice can be used to convert impulse readings, received from an mqtt topic, to a stock reading which then gets published to another mqtt topic. 

Example: A gas counter might pulse / send a signal every time a counter traverses the 0. To get the stock of the counter one could either implement the tracking of the stock onto the counter senser itself or outsource it into a service like node-i2r.
The stock reading can be set via a simple web interface and is persistent across reboots or container changes.

## What's inside?

The microservice consists of a dockerized nodejs application with a minimalistic html ui to set the current stock value.

### Limitations

The project is mainly set up to fit my personal needs and therefore has some limitations regarding the compatibility to communicate with certain mqtt brokers. 
Currently you can only use a broker that requires authentication.

## Commands to work with this project

### Prerequisites

Both of these tools have to be installed

* Docker
* git

### Get the project

    git clone https://github.com/jubidev/node-i2r.git

### Build the docker image

    docker build -t node-i2r .

### configure parameters in start.sh

    vi start.sh

### Start the container

    ./start.sh