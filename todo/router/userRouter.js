const router = require("express").Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../controllers/authController");

router.get("/", userController.getAllUsers);
router.get("/:id", verifyToken, userController.getUser);
router.delete("/:id", userController.deleteUser);
router.patch("/:id", userController.updateUser);

module.exports = router;
