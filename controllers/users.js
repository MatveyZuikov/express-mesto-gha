const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const saltRounds = 10;

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      return UserModel.create({ name, about, avatar, email, password: hash });
    })
    .then((data) => {
      return res.status(201).send(data);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send(err);
      }
      return res.status(500).send("На сервере произошла ошибка");
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      res.cookie("jwt", token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      res.status(401).send({ message: err.message });
    });
};

const getUsers = (req, res) => {
  UserModel.find()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.err(err);
      return res.status(500).send("На сервере произошла ошибка");
    });
};

const getMe = (req, res) => {
  const { _id } = req.user;

  UserModel.find(_id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.err(err);
      return res.status(500).send("На сервере произошла ошибка");
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;

  UserModel.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "На сервере произошла ошибка" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        return res.status(400).send(err);
      }
      return res.status(500).send("На сервере произошла ошибка");
    });
};

const updateUserById = (req, res) => {
  const owner = req.user._id;
  const userData = req.body;

  UserModel.findByIdAndUpdate(owner, userData, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(400).send(err);
      }
      return res.status(500).send("На сервере произошла ошибка");
    });
};

const updateUserAvatar = (req, res) => {
  const owner = req.user._id;
  const userData = req.body;

  UserModel.findByIdAndUpdate(owner, userData, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send(err);
      }
      return res.status(500).send("На сервере произошла ошибка");
    });
};

module.exports = {
  createUser,
  getUsers,
  getMe,
  getUserById,
  updateUserById,
  updateUserAvatar,
  login,
};
