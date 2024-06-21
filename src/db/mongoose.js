const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_PATH}.mongodb.net/${process.env.ENVIRONMENT}?retryWrites=true&w=majority`
  )
  .catch((error) => {
    mongoose.disconnect();
  });
