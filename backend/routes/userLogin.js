const express = require('express');
const router = express.Router();
const userLoginController = require('../controller/authController');

router.post('/', userLoginController.login);
router.get("/auth", userLoginController.checkAuthentication);

module.exports = router;