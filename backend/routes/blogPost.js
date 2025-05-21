const express = require('express');
const router = express.Router();
const BlogPostController = require('../controller/blogPostController');

//create blog post
router.post("/create", BlogPostController.createBlogPost);

//get all blog posts
router.get("/all", BlogPostController.getAllBlogPosts);
//get all blog for one user
router.get("/userBlogs", BlogPostController.getAllBlogPostForUser);
//get by id
router.get("/blog/:id", BlogPostController.getBlogPostByIdSQL)
//get all blogs for selected country
router.get("/country/:id", BlogPostController.getAllBlogPostsForCountry);
//update
router.put("/update/:id", BlogPostController.updateBlogPost);
//delete
router.delete("/delete/:id", BlogPostController.deleteBlogPost);
//get blog post by blog id
router.get("/blog/:id", BlogPostController.getBlogPostById);

module.exports = router;