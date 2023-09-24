const express = require("express");
const app = express();
const cors = require("cors");
const demo = require("./routes/demo.routes");
const AuthRouter = require("./routes/Auth.routes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const chatRoutes = require("./routes/Chat.routes");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/demo", demo);
app.use("/api", AuthRouter);
app.use("/api/chat", chatRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
