const mongoose = require("mongoose");

function connectDB(url) {
  try {
    mongoose.set("strictQuery", true);
    mongoose
      .connect(url)
      .then((db) => {
        console.log(`Mongodb connections established`.cyan.bold);
      })
      .catch((err) => {
        console.log(`Mongodb connection error: ${err}`.red);
      });
  } catch (error) {
    console.log(`Mongodb connection error: ${error}`.red);
  }
}

module.exports = connectDB;
