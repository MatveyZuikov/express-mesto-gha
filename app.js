const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

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

app.get("/", (req, res) => {
  res.send("hello");
});

app.use((req, res, next) => {
  req.user = {
    _id: "65484e860b2f4ca2a3be8df8",
  };

  next();
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
