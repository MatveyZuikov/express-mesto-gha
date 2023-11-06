const router = require("express").Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatar,
} = require("../controllers/users");

router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.patch("/users/me", updateUserById);
router.patch("/users/me/avatar", updateUserAvatar);

module.exports = router;
