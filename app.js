const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const fs = require('fs/promises');
const bodyParser = require('body-parser');

let stockValue = 0.0;
let sendStockValues = false; // Variable to track whether to send stock values or not
const stockFile = 'stock.txt';

const app = express();
const server = http.createServer(app);
const PORT = 3000;


// MQTT Connection
const mqttBroker = process.env.MQTT_BROKER; // Update with your MQTT broker URL
const mqttOptions = {
  clientId: 'node-i2r', // Set a unique client ID
  username: process.env.MQTT_USERNAME || '',
  password: process.env.MQTT_PASSWORD || '',
};

const impulseTopic = process.env.MQTT_IMPULSE_TOPIC;
const stockTopic = process.env.MQTT_STOCK_TOPIC;

app.use(bodyParser.urlencoded({ extended: true }));

const createStockFile = async () => {
  try {
    await fs.access(stockFile);
  } catch (error) {
    console.log(`Creating ${stockFile} with initial value`);
    await fs.writeFile(stockFile, '0.0');
  }
};

const loadStockValue = async () => {
  await createStockFile();

  const data = await fs.readFile(stockFile, 'utf8');
  stockValue = parseFloat(data) || 0.0;
};

loadStockValue();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/update', (req, res) => {
  const newStockValue = parseFloat(req.body.newStockValue);
  if (!isNaN(newStockValue)) {
    stockValue = newStockValue;

    fs.writeFile(stockFile, stockValue.toString())
      .catch((error) => {
        console.error('Error writing to stock file:', error);
      });

    res.redirect('/');
  } else {
    res.status(400).send('Invalid input. Please enter a valid number.');
  }
});

app.get('/toggle', (req, res) => {
  sendStockValues = !sendStockValues;
  res.send(`Sending stock values is now ${sendStockValues ? 'enabled' : 'disabled'}`);
});

app.get('/status', (req, res) => {
  res.json({ sendStockValues });
});

app.get('/stock', (req, res) => {
  res.json({ stockValue });
});

process.on('SIGINT', () => {
  console.log('Shutting down...');

  mqttClient.end(() => {
    console.log('Disconnected from MQTT broker');
    process.exit();
  });
});

server.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
  console.log('MQTT application running');
});

const publishStockValue = () => {
  if(sendStockValues){
    mqttClient.publish(stockTopic, stockValue.toFixed(3));
  }
};

const mqttClient = mqtt.connect(mqttBroker, mqttOptions);

mqttClient.on('connect', () => {
  // Subscribe to the correct MQTT topic
  mqttClient.subscribe(impulseTopic);
});

mqttClient.on('message', (topic, message) => {
  if (topic === impulseTopic) {
    stockValue += parseFloat(message.toString()) || 0.0;

    fs.writeFile(stockFile, stockValue.toString())
      .catch((error) => {
        console.error('Error writing to stock file:', error);
      });
  }
});

setInterval(publishStockValue, 60000);