const express = require('express');
const router = express.Router();
const UserFollowersController = require('../controller/userFollowerController')

//get followers for a specific user
router.get("/followers", UserFollowersController.getFollowerList);
//get following list
router.get("/followings", UserFollowersController.getFollowingList);
//follow user
router.post("/follow/:id", UserFollowersController.followUser);
//follow user
router.delete("/unfollow/:id", UserFollowersController.unfollowUser);

module.exports = router;