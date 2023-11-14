const express = require("express");
const mongoose = require("mongoose");
const router = require("express").Router();
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const cookieParser = require("cookie-parser");
const { login, createUser } = require("./controllers/users");
const { celebrate, Joi, errors } = require("celebrate");
const auth = require("./middlewares/auth");
const handleError = require("./middlewares/handleError");
const LinkPattern = require("./utils/avatarPattern");
const NotFoundError = require("./errors/NotFoundError");

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  });

const app = express();
const PORT = 3000;
app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(LinkPattern),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.use(auth);

app.use(usersRouter);
app.use(cardsRouter);
app.all("*", (req, res, next) => {
  throw new NotFoundError("Page not found");
});

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
