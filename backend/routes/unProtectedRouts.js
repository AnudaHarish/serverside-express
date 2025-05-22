const express = require('express');
const router = express.Router();
const BlogPostController = require('../controller/blogPostController');
const countriesController = require("../controller/countriesController");
const UserController = require("../controller/userController");

router.get('/search', BlogPostController.searchBlogPost);
router.get("/nameList", countriesController.handleNameList);
router.get("/usernameList", UserController.getUsernameList);
router.get("/blog/:id", BlogPostController.getBlogPostByIdSQL);

module.exports = router;