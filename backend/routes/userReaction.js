const express = require('express');
const router = express.Router();
const ReactionController = require('../controller/userReactionController');

//add user reaction for a blog
router.post('/add', ReactionController.addingReaction);

//removing a reaction
router.delete('/remove/:id', ReactionController.removeReaction);

//get total like for a blog
router.get('/likes/:id', ReactionController.getTotalLikes);

//get total dislike for a blog
router.get('/dislikes/:id', ReactionController.getTotalLikes);

//get the reaction of the user for a specific blog
router.get('/reaction/:id', ReactionController.getTotalDislikes);

module.exports = router;