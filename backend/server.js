const app = require("./app");
const connectDB = require("./config/connectDB");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
require("colors");

((async) => {
  app.listen(PORT, () => {
    connectDB(process.env.MONGO_URI);
    console.log(`Server listening on port ${PORT}`.cyan.bold);
  });
})();
