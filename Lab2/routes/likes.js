const express = require('express');
const router = express.Router();
const likesData = require('../data/likes');
const {ObjectId} = require('mongodb');

const redis = require("redis");
const redisClient = redis.createClient();

(async () => {
  await redisClient.connect();
})();


router.route('/:id/likes').post(async (req, res) => {
  if(!req.session.loginStatus)
    return res.status(403).json({message: "User is not logged in."});
  
  if (!req.params.id.trim().length) 
    return res.status(400).json({ error: 'ID provided only contains blank spaces' });

  if(!ObjectId.isValid(req.params.id))
    return res.status(400).json({ error: 'The ID is not a valid Object ID' });
  
  try{
    recipeId = req.params.id.trim();
    userId= req.session.userDetails.userId;
    const addedLikes = await likesData.addLikes(userId, recipeId);

    if(await redisClient.exists(`recipes:${req.params.id}`)){
      await redisClient.set(`recipes:${req.params.id}`, JSON.stringify(addedLikes));
      await redisClient.ZINCRBY('recipeAccessCounts', 1, req.params.id);
      console.log('Likes Updated in the cache');
    }

    res.status(200).json(addedLikes);
  } catch(e){
    res.status(404).json({ error: 'Recipe not found' });
  }

  });

    module.exports = router;