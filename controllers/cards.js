const CardModel = require("../models/card");

const getCards = (req, res) => {
  CardModel.find()
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      console.err(err);
      return res.status(500).send("На сервере произошла ошибка");
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return CardModel.create({ name: name, link: link, owner: owner })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      // console.log(err);
      if (err.name === "ValidationError") {
        return res.status(400).send(err.message);
      }
      return res.status(500).send("На сервере произошла ошибка");
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  CardModel.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send("Card not found");
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      console.err(err);
      return res.status(500).send("На сервере произошла ошибка");
    });
};

const likeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  ).catch((err) => {
    console.err(err);
    return res.status(500).send("На сервере произошла ошибка");
  });
};

const dislikeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  ).catch((err) => {
    console.err(err);
    return res.status(500).send("На сервере произошла ошибка");
  });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
