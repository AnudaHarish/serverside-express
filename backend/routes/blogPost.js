const express = require('express');
const router = express.Router();
const BlogPostController = require('../controller/blogPostController');

//create blog post
router.post("/create", BlogPostController.createBlogPost);

//update
router.post("/update/:id", BlogPostController.updateBlogPost);

//delete
router.delete("/delete/:id", BlogPostController.deleteBlogPost);

//get all blog posts
router.get("/all", BlogPostController.getAllBlogPosts);

//get blog post by blog id
router.get("/blog/:id", BlogPostController.getBlogPostById);

//get all blog for one user
router.get("/userBlogs", BlogPostController.getAllBlogPostForUser);

//get all blogs for selected country
router.get("/country", BlogPostController.getAllBlogPostsForCountry);

module.exports = router;