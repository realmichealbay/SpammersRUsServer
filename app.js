const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const helmet = require("helmet");
const { check, validationResult } = require("express-validator");

const kahoot = require("./Scrapers/Kahoot.js");
const app = express();

app.use(
  bodyParser.json(),
  cors({
    origin: ["https://spammersrus.com", "http://127.0.0.1:5500"],
  }),
  helmet()
);

app.post(
  "/Code-Submit",
  [check("type").isString(), check("code").isString()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("Type Recieved " + req.body.type);
    console.log("Code Recieved " + req.body.code);
    res.status(200).json({
      message: "200 Data Received",
      body: req.body,
    });

    if (req.body.type === "Kahoot") {
      kahoot.startKahoot(req.body.code, "thug", true); // replace "PlayerName" and true with appropriate values
    }
  }
);

const PORT = process.env.PORT || 4000;

const options = {
  cert: fs.readFileSync("../certs/fullchain.pem"),
  key: fs.readFileSync("../certs/privkey.pem"),
};

https.createServer(options, app).listen(PORT, () => {
  console.log("Server is starting on", PORT, "using HTTPS");
});
