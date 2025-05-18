const BlogPostDAO = require("../dao/blog_postDAO");
const CountryDAO = require("../dao/countryDAO");
const UserReactionDAO = require("../dao/blogPostLikesDAO");

//create a blog post
const createBlogPost = async (req,res) => {
    try{
        //extract blog post details
        const {countryData, blogPostData} = req.body;
        const {name, flag, capital, currency, region, languages} = countryData
        const {title, content, date_of_visit} = blogPostData;
        //extract user id
        const user_id = req?.user?.id;
        //check for required fields
        if(!user_id){
            return res.status(401).json({error: "User not authenticated"});
        }
        if((!title || !content || !date_of_visit)||
            (!name || !flag || !currency || !capital || !region || languages.length === 0)){
            return res.status(400).json({error: "Missing required fields"});
        }
        //change to json string
        countryData.languages = JSON.stringify(languages);
        //save country data
        let country_id = await CountryDAO.create(countryData);
        if(!country_id){
            const data = await  CountryDAO.getByName(name);
            console.log(data);
            if(!data){
                return res.status(404).json({error: "Could not find country"});
            }
            country_id = data.id;
        }
        console.log(country_id);
        //create blog post
        const blogPostId = await BlogPostDAO.createBlog({
            user_id,
            title,
            content,
            country_id,
            date_of_visit,
        });
        //return success with new blog postId
        return res.status(201).json({
                message: "Blog post created successfully",
                blogPostId: blogPostId,
            }
        );
    }catch (err){
        console.error("Error creating blogPost", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

//get all blog posts
const getAllBlogPosts = async (req,res) => {
    try{
        const posts = await BlogPostDAO.getAll();
        const countries = await CountryDAO.getAll();
        //get likes for the post
        const likes = await UserReactionDAO.getLikedPosts() || [];
        const dislikes = await UserReactionDAO.getDislikedPosts() || [];
        let reactionsArr = [];
        //get logged user
        const user_id = req?.user?.id || null;
        if(user_id){
            reactionsArr = [...likes, ...dislikes];
        }
        //creating a key value pair map
        const countriesMap = new Map(countries.map((c) => [c.id, c]));
        posts.forEach((post) => {
            post.country = countriesMap.get(post.country_id);
            post.likes = likes.filter(reaction => reaction.blog_post_id === post.id).length || 0;
            post.dislikes = dislikes.filter(reaction => reaction.blog_post_id === post.id).length || 0;
            let reaction = reactionsArr.find(reaction => (reaction.blog_post_id === post.id && reaction.user_id === user_id));
            post.reaction = reaction ? reaction.is_like : null;
        });
        //get like for the blog
        return res.status(200).json({
            message: "Blog posts successfully",
            payload: posts
        });
    }catch (err){
        console.error("Error getting blog posts", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

//update a blog post
const updateBlogPost = async (req,res) => {
    try{
        //get data from the req
        const {title, content} = req.body;
        const id = req.params.id;
        const user_id = req.user.id;
        //valid required fields
        if(!user_id){
            return res.status(401).json({error: "user not authorized"});
        }
        if(!title || !content || !id){
            res.status(400).json({error: "Missing required fields"});
        }
        //check the user has the permission to update
        const postData = await BlogPostDAO.getById(id);
        if(!postData){
            return res.status(404).json({error: "Could not find post"});
        }
        if(postData.user_id !== user_id){
            return res.status(403).json({error: "User has not the permission"});
        }
        const change = await BlogPostDAO.updateBlog(id,{
            title,
            content,
        });
        if(!change){
            return res.status(404).json({error: "Blog post not found"});
        }
        return res.status(200).json({
            message: "Blog post updated successfully"
        });
    }catch (err){
        console.error("Error updating blog post", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

//get blog post by ID
const getBlogPostById = async (req, res) => {
    try{
        //get post id from the req
        const id = req.params.id;
        //check for required fields
        if(!id){
            res.status(400).json({error: "Missing required fields"});
        }
        const post = await BlogPostDAO.getById(id);
        //check post exists
        if(!post){
            return res.status(404).json({error: "Blog post not found"});
        }
        return res.status(200).json({
            message: "Retrieve log post successfully",
            payload: post,
        });
    }catch (err){
        console.error("Error getting blog post", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

//get all blog posts for a user
const getAllBlogPostForUser = async (req,res) => {
    try{
        //get user_id
        const user_id = req?.user?.id;
        if(!user_id){
            res.status(401).json({error: "User not authenticated"});
        }
        //retrieve from database
        const posts = await BlogPostDAO.getByUserId(user_id) || [];
        const countries = await CountryDAO.getAll();
        //creating key value pair map
        const countryMap = new Map(countries.map((c) => [c.id, c]));
        posts.forEach((post) => {
            post.country = countryMap.get(post.country_id);
        })
        return res.status(200).json({
            message: "Blog post retrieval was successful",
            payload: posts,
        });
    }catch(err){
        console.log("Error getting blog post for user", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

const getAllBlogPostsForCountry = async (req,res) => {
    try{
        //get country id
        const country_id = req.params.id;
        //check for required fields
        if(!country_id){
            return res.status(400).json({error: "Missing required fields"});
        }
        const posts = await BlogPostDAO.getByCountryId(country_id) || [];
        const country = await CountryDAO.getById(country_id);
        if(!country){
            return res.status(404).json({error: "country not found"});
        }
        posts.forEach((post) => {
            post.country = country;
        });
        return res.status(200).json({
            message: "Blog post retrieved successfully",
            payload: posts,
        });
    }catch (err){
        console.error("Error getting blog post for country", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

const deleteBlogPost = async (req,res) => {
    try{
        const id = req.params.id;
        const user_id = req?.user?.id;
        if(!user_id){
            res.status(401).json({error: "User not authenticated"});
        }
        if(!id){
            res.status(400).json({error: "Missing required fields"});
        }
        //check the user has the permission to update
        const postData = await BlogPostDAO.getById(id);
        if(!postData){
            return res.status(404).json({error: "Could not find post"});
        }
        if(postData.user_id !== user_id){
            return res.status(403).json({error: "User has not the permission"});
        }
        const change = await BlogPostDAO.delete(id);
        if(!change){
            return res.status(404).json({error: "Blog post not found"});
        }
        return res.status(204).json({
            message: "Blog post deleted successfully",
        });
    }catch (err){
        console.error("Error getting blog post for user", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

module.exports = {createBlogPost, getAllBlogPosts, updateBlogPost, getAllBlogPostForUser, getBlogPostById, getAllBlogPostsForCountry, deleteBlogPost}