const express = require('express');
const router = express.Router();
const CommentsController = require('../controller/commentsController');

//creating a comment
router.post('/create/:id', CommentsController.createComment);
//update a comment
router.put('/update/:id', CommentsController.updateComment);
//delete a comment
router.delete('/delete/:id', CommentsController.deleteComment);

module.exports = router;