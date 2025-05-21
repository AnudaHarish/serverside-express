const express = require("express");
const router = express.Router();
const UserController = require("../controller/userController");

router.put("/update", UserController.updateUser);
router.get("/:id", UserController.getUserDetails);

module.exports = router;