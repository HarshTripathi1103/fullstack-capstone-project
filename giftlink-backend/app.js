require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pinoLogger = require("./logger");

const connectToDatabase = require("./models/db");
const { loadData } = require("./util/import-mongo/index");

const app = express();
app.use("*", cors());
const port = 3060;

connectToDatabase()
  .then(() => {
    pinoLogger.info("Connected to DB");
  })
  .catch((e) => console.error("Failed to connect to DB", e));

app.use(express.json());

const giftRoutes = require("/", require("./routes/giftRoutes"));

// Search API Task 1: import the searchRoutes and store in a constant called searchRoutes
//{{insert code here}}

const pinoHttp = require("pino-http");
const logger = require("./logger");

app.use(pinoHttp({ logger }));

app.use("/api/gifts", giftRoutes);

// Search API Task 2: add the searchRoutes to the server by using the app.use() method.
//{{insert code here}}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

app.get("/", (req, res) => {
  res.send("Inside the server");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
