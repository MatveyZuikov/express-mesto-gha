const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatar,
  login,
  getMe,
} = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

router.use(auth);

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.get("/users/me", getMe);
router.patch("/users/me", updateUserById);
router.patch("/users/me/avatar", updateUserAvatar);

module.exports = router;
