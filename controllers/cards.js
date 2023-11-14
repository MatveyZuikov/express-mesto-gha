const CardModel = require("../models/card");

const ValidationError = require("../errors/ValidationError");
const AuthForbiddenError = require("../errors/AuthForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const CastError = require("../errors/CastError");

const getCards = (req, res, next) => {
  CardModel.find()
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return CardModel.create({ name, link, owner })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ValidationError("Некорректные данные"));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  if (req.user._id === card.owner.toString()) {
    CardModel.findByIdAndRemove(cardId)
      .then((card) => {
        if (!card) {
          throw new NotFoundError("Карточка не найдена");
        }
        res.status(200).send(card);
      })
      .catch((err) => {
        if (err.name === "CastError") {
          return next(new CastError("Некорректные данные"));
        }
        return next(err);
      });
  } else {
    return Promise.reject(
      new AuthForbiddenError("У вас нет прав на удаление этой карточки")
    );
  }
};

const likeCard = (req, res, next) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка не найдена");
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new CastError("Некорректные данные"));
      }
      return next(err);
    });
};

const dislikeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка не найдена");
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new CastError("Некорректные данные"));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
