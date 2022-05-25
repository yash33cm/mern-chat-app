const express = require("express");
const helmet = require("helmet");
const createError = require("http-errors");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
require("./models/dbconfig/dbcon");
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get("/", async (req, res, next) => {
  res.send({ message: "Awesome it works 🐻" });
});

//app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/chats", require("./routes/chat"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
