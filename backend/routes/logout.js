const express = require('express');
const router = express.Router();
const logoutTokenController = require('../controller/logoutController');

router.get('/', logoutTokenController.handleLogout);

module.exports = router;