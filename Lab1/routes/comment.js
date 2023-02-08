//require express and express router as shown in lecture code
const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const recipeData= data.recipes;
const { ObjectId } = require('mongodb');
const helper = require('../helpers');

router.route('/:id/comments').post(async (req, res) => {
  if(!req.session.loginStatus)
    return res.status(403).json({message: "User is not logged in."});

  let commentInfo = req.body;
  if (!req.params.id)
    return res.status(400).json({ error: 'You must provide an ID' });

  if (!req.params.id.trim().length) 
    return  res.status(400).json({ error: 'ID provided only contains blank spaces' });

  if(!ObjectId.isValid(req.params.id))
    return res.status(400).json({ error: 'The ID is not a valid Object ID' });

  if (!commentInfo)
    return res.status(400).json({ error: 'Provide data to post a comment' });

  try{
    helper.commentErrorChecking(commentInfo.comment);
  }
  catch(e){
    return res.status(400).json({ error: e });
  } 

  try {
    await recipeData.getRecipeById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: 'Recipe not found' });
    return;
  }

  try {
    const newComment = await commentData.createComment(
      req.params.id,
      req.session.userObject,
      commentInfo.comment
    );
    res.json(newComment);
  } catch (e) {
    res.status(400).json({ error: e });
    }
})

router.route('/:recipeId/:commentId').delete(async (req, res) => {   
  if(!req.session.loginStatus) {
    return res.status(403).json({message: "User is not logged in, Login to delete a comment!"});
  }
  
  if (!req.params.recipeId || !req.params.commentId) {
    res.status(400).json({ error: 'You must provide an ID' });
    return;
  }
  if (!req.params.recipeId.trim().length || !req.params.commentId.trim().length) {
    res.status(400).json({ error: 'ID provided only contains blank spaces' });
    return;
  }
  if(!ObjectId.isValid(req.params.recipeId) || !ObjectId.isValid(req.params.commentId)) {
    res.status(400).json({ error: 'The ID is not a valid Object ID' });
    return;
  }

  try {
    let commentInfo= await commentData.getComment(req.params.commentId);
    // console.log(commentInfo.userThatPostedComment.username);
    // console.log(req.session.userDetails.username);
    if(commentInfo.userThatPostedComment.username !== req.session.userDetails.username) {
      return res.status(403).json({ error: 'You can not delete someone else\'s comment!' });
    }
  } catch (e) {
    return res.status(404).json({ error: 'Comment not found' });
  }
    
  try {
    const deletedComment = await commentData.removeComment(req.params.commentId, req.session.userDetails.username);
    //console.log(deletedComment);
    res.json(deletedComment);
  } catch (e) {
    res.status(500).json({ error: 'Comment cannot be deleted' });
  }
  });

  module.exports = router;
