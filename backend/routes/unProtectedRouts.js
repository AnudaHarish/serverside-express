const express = require('express');
const router = express.Router();
const BlogPostController = require('../controller/BlogPostController');

router.get('/search', BlogPostController.searchBlogPost);

module.exports = router;