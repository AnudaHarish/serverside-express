const express = require('express');
const router = express.Router();
const UserFollowersController = require('../controller/userFollowerController')

router.get("/userList", UserFollowersController.getUsersNotFollowed);
//get followers for a specific user
router.get("/followers", UserFollowersController.getFollowerList);
router.get("/filter/followers", UserFollowersController.getFollowersByUsername);
//get following list
router.get("/followings", UserFollowersController.getFollowingList);
router.get("/filter/followings", UserFollowersController.getFollowingsByUsername)
//follow user
router.post("/create", UserFollowersController.followUser);
//follow user
router.delete("/unfollow/:id", UserFollowersController.unfollowUser);

module.exports = router;