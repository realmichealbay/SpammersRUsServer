const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const cors = require("cors");

//testing github actions/

const app = express();

app.use(bodyParser.json(),cors());

app.post('/test', (req, res) => {
  console.log("Type Recieved "+ req.body.type);
  console.log("Code Recieved "+ req.body.code);
  res.status(200).send('200 Data Received' + req.body);
});

const PORT = process.env.PORT || 4000;

const options = {
  cert: fs.readFileSync('../certs/fullchain.pem'),
  key: fs.readFileSync('../certs/privkey.pem')
};

https.createServer(options, app).listen(PORT, () => {
  console.log('Server is starting on', PORT, 'using HTTPS');
});