const express = require("express");
const app = express();
const cors = require("cors");
const demo = require("./routes/demo.routes");

app.use(cors());
app.use("/demo", demo);

module.exports = app;
