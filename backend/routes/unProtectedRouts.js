const express = require('express');
const router = express.Router();
const BlogPostController = require('../controller/BlogPostController');
const countriesController = require("../controller/countriesController");

router.get('/search', BlogPostController.searchBlogPost);
router.get("/nameList", countriesController.handleNameList);

module.exports = router;