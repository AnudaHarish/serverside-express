const express = require('express');
const router = express.Router();
const BlogPostController = require('../controller/BlogPostController');
const countriesController = require("../controller/countriesController");
const UserController = require("../controller/userController");

router.get('/search', BlogPostController.searchBlogPost);
router.get("/nameList", countriesController.handleNameList);
router.get("/usernameList", UserController.getUsernameList);

module.exports = router;