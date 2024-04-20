const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const projectRouter = require("./routers/project");
var cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;


var corsOptions = {
  origin: 'http://gabrielm.com.br'
}

app.use(cors());


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(projectRouter);

app.get("/", async (req, res) => {
  res.status(200).send({ message: "ok" });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
