const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");
const LinkPattern = require("../utils/avatarPattern");

router.post(
  "/cards",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(LinkPattern),
    }),
  }),
  createCard
);
router.get("/cards", getCards);
router.delete(
  "/cards/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  deleteCard
);
router.put(
  "/cards/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  likeCard
);
router.delete(
  "/cards/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  dislikeCard
);

module.exports = router;
