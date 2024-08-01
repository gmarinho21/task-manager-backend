const mongoose = require("mongoose");

try {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_PATH}.mongodb.net/${process.env.ENVIRONMENT}?retryWrites=true&w=majority`
  );
  console.log("Connected to the DB");
} catch (error) {
  mongoose.disconnect();
  console.log("Could not connect to the DB");
}
