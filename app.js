const express = require("express");
const mongoose = require("mongoose");
const router = require("express").Router();
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const cookieParser = require("cookie-parser");


mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  });

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use(usersRouter);
app.use(cardsRouter);


app.all("*", (req, res) => {
  res.status(404).send({ message: "Page not found" });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
