const router = require("express").Router();

const {
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatar,
  getMyInfo,
} = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.get("/users/me", getMyInfo);
router.patch("/users/me", updateUserById);
router.patch("/users/me/avatar", updateUserAvatar);

module.exports = router;
