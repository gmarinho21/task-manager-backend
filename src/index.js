const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
var cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

router.post("/", async (req, res) => {

    res.status(200).send({message: "ok"});
  
});



app.listen(port, () => {
  console.log("Server is up on port " + port);
});
