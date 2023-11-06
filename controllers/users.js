const UserModel = require("../models/user");

const createUser = (req, res) => {
  const userData = req.body;

  return UserModel.create(userData)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      // console.log(err);
      if (err.name === "ValidationError") {
        return res.status(400).send(err.message);
      }
      return res.status(500).send("Server Error");
    });
};

const getUsers = (req, res) => {
  UserModel.find()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.err(err);
      return res.status(500).send("Server Error");
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;

  UserModel.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found");
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send(err.message);
      }
      return res.status(500).send("Server Error");
    });
};

const updateUserById = (req, res) => {
  const owner = req.user._id;
  const userData = req.body;

  UserModel.findByIdAndUpdate(owner, userData)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send(err.message);
      }
      return res.status(500).send("Server Error");
    });
};

const updateUserAvatar = (req, res) => {
  const owner = req.user._id;
  const userData = req.body;

  UserModel.findByIdAndUpdate(owner, userData)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send(err.message);
      }
      return res.status(500).send("Server Error");
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatar,
};
