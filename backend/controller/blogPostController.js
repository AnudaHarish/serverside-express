const BlogPostDAO = require("../dao/blog_postDAO");
const CountryDAO = require("../dao/countryDAO");
const UserReactionDAO = require("../dao/blogPostLikesDAO");

//create a blog post
const createBlogPost = async (req,res) => {
    try{
        //extract blog post details
        const {countryData, blogPostData} = req.body;
        console.log("req.body", req.body)
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
    }catch(err){
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
    }catch(err){
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
    }catch(err){
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
    }catch(err){
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
    }catch(err){
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
    }catch(err){
        console.error("Error getting blog post for user", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

//retrieve query parameters with defaults
//for filtering: country and username
//for pagination: page and size
//for sort: sort can be "newest", "mostLiked", "mostCommented"
const searchBlogPost = async (req, res) => {
    try{
        const {country = "", username = "", page = 1, size = 10, sort = "newest"} = req.query;
        const limit = parseInt(size);
        const offset = (parseInt(page) - 1) * limit;

        //prepare search parameters for sql like
        const countryParam = `%${country}`;
        const usernameParam = `%${username}`;

        //building the base query by joining the blog posts, country, users
        //add sub queries returning the like and comment count
        let baseQuery = `
            SELECT
                bp.id,
                bp.title,
                bp.created_at,
                u.username AS author,
                c.name AS country,
                (SELECT COUNT(*) FROM blog_post_likes l WHERE l.blog_post_id = bp.id AND is_like = 1) AS likes_count,
                (SELECT COUNT(*) FROM blog_post_likes l WHERE l.blog_post_id = bp.id AND is_like = 0) AS dislikes_count,
                (SELECT COUNT(*) FROM blog_post_comments cm WHERE cm.blog_post_id = bp.id) AS comments_count
            FROM blog_posts bp
            JOIN users u ON bp.user_id = u.id
            JOIN countries c ON bp.country_id = c.id
            WHERE 1=1       
        `;

        const params = [];
        if(country){
            baseQuery += ` AND c.name LIKE ?`;
            params.push(countryParam);
        }
        if(username){
            baseQuery += ` AND u.username LIKE ?`;
            params.push(usernameParam);
        }

        //build the order by clause based on the sort option
        let orderClause = "";
        if(sort === 'mostLiked'){
            orderClause = ` ORDER BY likes_count DESC`;
        }else if(sort === 'mostCommented'){
            orderClause = ` ORDER BY comments_count DESC`;
        }else{
            orderClause = ` ORDER BY bp.created_at DESC`;
        }

        //append the pagination clause
        const limitClause = ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        //the final query with dynamic filtering, sorting and pagination
        const finalQuery = baseQuery + orderClause + limitClause;

        //execute query
        const posts = await BlogPostDAO.queryAll(finalQuery, params);

        //get total count for pagination
        let countQuery = `
            SELECT COUNT(*) AS total 
            FROM blog_posts bp
            JOIN users u ON bp.user_id = u.id
            JOIN countries c ON bp.country_id = c.id
            WHERE 1=1
        `;
        const countParams = [];
        if(country){
            countQuery += ` AND c.name LIKE ?`;
            countParams.push(countryParam);
        }
        if(username){
            countQuery += ` AND u.username LIKE ?`;
            countParams.push(usernameParam);
        }

        const countResults = await BlogPostDAO.queryOne(countQuery, countParams);
        const total = countResults.total;
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            payload: posts,
            metadata: {
                pages: parseInt(page),
                size: limit,
                total,
                totalPages,
                sort
            }
        })
    }catch(err){
        console.error("Error searching blog post", err);
        return res.status(500).json({error: "Internal server error"});
    }
}

const getBlogPostByIdSQL = async (req, res) => {
    try{
        const id = req.params.id;
        if(!id){
            return res.status(400).json({error: "Blog post id is required"});
        }
        //query1: get blog post data along with country details
        const postQuery = `
            SELECT
                bp.*,
                c.name AS country_name,
                c.currency AS currency,
                c.capital AS capital,
                c.languages AS languages,
                c.flag AS flag,
                u.username AS username
            FROM blog_posts bp
            JOIN countries c ON bp.country_id = c.id
            JOIN users u ON bp.user_id = u.id
            WHERE bp.id = ?  
        `;
        const post = await BlogPostDAO.queryOne(postQuery, [id]);
        if(!post){
            return res.status(404).json({error: "Blog post not found"});
        }
        //query2: get dislike and like count
        const likeQuery = `SELECT COUNT(*) AS count FROM blog_post_likes WHERE blog_post_id = ? AND is_like = 1`;
        const disLikeQuery = `SELECT COUNT(*) AS count FROM blog_post_likes WHERE blog_post_id = ? AND is_like = 0`;

        const dislikeResults = await BlogPostDAO.queryOne(disLikeQuery, [id]);
        const likeResults = await BlogPostDAO.queryOne(likeQuery, [id]);
        const likeCount = likeResults ? likeResults.count : 0;
        const dislikeCount = dislikeResults ? dislikeResults.count : 0;

        //query3: get comments
        const commentQuery = `
            SELECT 
                bc.*,
                u.username AS commented_username
            FROM blog_post_comments bc
            JOIN users u ON bc.user_id = u.id
            WHERE blog_post_id = ?
            ORDER BY created_at ASC     
        `;
        const comments = await BlogPostDAO.queryAll(commentQuery, [id]);

        //query4:check current user liked or disliked the post
        let currentUserStatus = null;
        console.log("user_id", req.user)
        if(req.user && req.user.id){
            const user_id = req.user.id;
            const query = `
                SELECT is_like
                FROM blog_post_likes
                WHERE blog_post_id = ? AND user_id = ?
            `;
            const result = await BlogPostDAO.queryOne(query, [id, user_id]);
            if(result){
                console.log("result",result);
                currentUserStatus = (result.is_like == 1);
            }
        }

        //adding the extracted data to the post
        post.like_count =  likeCount;
        post.dislike_count = dislikeCount;
        post.comment_count = comments.length;
        post.comments = comments;
        post.is_like = currentUserStatus;

        return res.status(200).json({
            message: "Successfully retrieved a blog post",
            payload: post
        });
    }catch(err){
        console.error("Error in getBlogPostByIdSQL", err);
        return res.status(500).json({error: "Internal server error"});
    }
}

module.exports = {createBlogPost, getAllBlogPosts, updateBlogPost, getAllBlogPostForUser, getBlogPostById, getAllBlogPostsForCountry, deleteBlogPost, searchBlogPost, getBlogPostByIdSQL}