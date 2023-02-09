const express = require('express');
const router = express.Router();
const likesData = require('../data/likes');
const {ObjectId} = require('mongodb');


router.route('/:id/likes').post(async (req, res) => {
  if(!req.session.loginStatus)
    return res.status(403).json({message: "User is not logged in."});
  
  recipeId = req.params.id.trim();
  userId= req.session.userDetails.userId;
  const addedLikes = await likesData.addLikes(userId, recipeId);
    res.json(addedLikes);
  });

    module.exports = router;
