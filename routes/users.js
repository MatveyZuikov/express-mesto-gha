const router = require("express").Router();
const LinkPattern = require("../utils/avatarPattern");
const { celebrate, Joi } = require("celebrate");

const {
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatar,
  getMyInfo,
} = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/me", getMyInfo);
router.get(
  "/users/:id",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().hex().length(24),
    }),
  }),
  getUserById
);
router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUserById
);
router.patch(
  "/users/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(LinkPattern),
    }),
  }),
  updateUserAvatar
);

module.exports = router;
