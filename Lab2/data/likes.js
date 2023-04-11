const mongoCollections = require('../config/mongoCollections');
const recipes = mongoCollections.recipes;
const { ObjectId } = require('mongodb');
const helper = require('../helpers');

const addLikes = async (userId, recipeId) => {
  
  if(helper.ObjectIDHandling(userId));
  if(helper.ObjectIDHandling(recipeId));

  userId = userId.trim();
  recipeId = recipeId.trim();

  const recipeCollection = await recipes();
  const recipeExists = await recipeCollection.findOne({_id: new ObjectId(recipeId)});
  if(recipeExists === null){
    throw [400, "Recipe does not exists, Please try again for another Recipe"];
  }

  if(recipeExists.likes.includes(userId)){
    //console.log("In removal");
    const removedLike = await recipeCollection.updateOne({_id: new ObjectId(recipeId)},{$pull:{"likes":userId}});
    if(!removedLike.matchedCount && !removedLike.modifiedCount)
      throw [500,"Removal of the Likes has been failed"];

  }
  else{
    //console.log("In addition");
    const addLikes = await recipeCollection.updateOne({_id: new ObjectId(recipeId)},{$push:{"likes":userId}});
    if(!addLikes.matchedCount && !addLikes.modifiedCount)
      throw [500,"Addition of the Likes has been failed"];  
  }
  
  const recipe = await recipeCollection.findOne({ _id: new ObjectId(recipeId)});  
  //console.log(recipe); 
  return recipe;
};

module.exports = {
  addLikes
};