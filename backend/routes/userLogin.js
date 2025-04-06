const express = require('express');
const router = express.Router();
const userLoginController = require('../controller/authController');

router.post('/', userLoginController.login);

module.exports = router;