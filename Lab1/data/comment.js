const mongoCollections = require('../config/mongoCollections');
const recipes = mongoCollections.recipes;
const { ObjectId } = require('mongodb');
const helper = require('../helpers');

const createComment = async (recipeId, userDetails, comment) => {

  if(!ObjectId.isValid(recipeId))
    throw [400,"The ID is not a valid Object ID"];

  try{
    helper.commentErrorChecking(comment);
  } catch (e) {
    throw e;
  }

  const recipeCollection = await recipes();
  const wrongRecipe = await recipeCollection.findOne({ _id: ObjectId(recipeId)});
  //console.log(wrongRecipe);

  if(wrongRecipe === null)
    throw [400,"Recipe does not exists, Please try again for another Recipe"];
  
  const newComment = {
    _id: new ObjectId(),
    userThatPostedComment: userDetails,
    comment: comment,
  };
  
  
  // console.log("below is new comment-31");
  // console.log(newComment);

  const addComment = await recipeCollection.updateOne(
    {_id: ObjectId(recipeId)},
    {$push: {comments: newComment}}
  )
  if(!addComment.matchedCount && !addComment.modifiedCount)
    throw [500,"Update of the Comment has been failed"];

  const recipe = await recipeCollection.findOne({ _id: ObjectId(recipeId)});    
  
  if (recipe === null)
    throw [400,"No Recipe found with that id"];

  recipe._id = recipe._id.toString();   

  for(let key in recipe) {
    if(typeof recipe[key] === 'object' && key === "comment") {
      if(Array.isArray(recipe[key])) {
        for(let i = 0; i < recipe[key].length; i++) {
          recipe[key][i]._id = recipe[key][i]._id.toString();
        }
      }
    }
  }
  // console.log(recipe);
  return recipe;
};

const getComment = async (commentId) => {   
  // console.log(commentId); 
  if (!commentId)
    throw [400,"You must provide valid ID"];

  if (typeof (commentId) !== 'string')
    throw [400,"Please Enter a string"];

  if(!commentId.trim().length)
    throw [400,"comment ID contains only blank spaces"];

  if(!ObjectId.isValid(commentId))
    throw [400,"The ID is not a valid Object ID"];
  
  // console.log("here 74");
  let resultData = {};
  const recipeCollection = await recipes();
  const recipe = await recipeCollection.find({}).toArray();
  // console.log("here 79 ");
  if(recipe === null)
    throw [404,"No Comment present with that ID"];

  // console.log("here 82");
  
  recipe.forEach(element => {
  element.comments.forEach(comment => {
    // console.log("yesss 87");
    // console.log(comment._id.toString())
    if(comment._id.toString() === commentId) {
      // console.log(comment._id.toString())
      // console.log("yesss 89");
      resultData = {
        "_id": comment._id,
        "userThatPostedComment": comment.userThatPostedComment,
        "comment": comment.comment                   
      };
    }
  })
});

  resultData._id = resultData._id.toString();
  // console.log("here 94");
  // console.log(resultData);
  return resultData;
};

const removeComment = async (commentId, username) => { 
  if (!commentId)
    throw [400,"You must provide valid ID"];

  if (typeof (commentId) !== 'string')
    throw [400,"Please Enter a string"];

  if(!commentId.trim().length)
    throw [400,"Comment ID contains only blank spaces"];

  if(!ObjectId.isValid(commentId))
    throw [400,"The ID is not a valid Object ID"];

  // console.log("here 110");
  
  let recipeID = "" 
  const recipeCollection = await recipes();
  const recipe = await recipeCollection.find({}).toArray();
  //console.log(movie);
  if(recipe=== null)
    throw [400,"This recipe ID does not exists"];
  
  recipe.forEach(element => {
    element.comments.forEach(data => {
      if(data._id.toString() === commentId) {
        recipeID = element._id;
        console.log(recipeID)
      }
    })
  });

  // console.log("hete 130  " + recipeID);

  const removeComment = await recipeCollection.updateMany({}, {$pull: {comments: {_id: ObjectId(commentId)}}});   
  // console.log(removeComment);
  if(!removeComment.matchedCount && !removeComment.modifiedCount)
    throw [500,"Can't remove this Comment"];
        
  const recipeComment = await recipeCollection.find({}).toArray();
  // console.log("this is recipeComment to be deleted!");
  if(recipeComment === null)
    throw [404,"No comment present with that Id"];


  const recipeReturned = await recipeCollection.findOne({ _id: ObjectId(recipeID)});
  return recipeReturned; 
}

module.exports = {
  createComment,
  getComment,
  removeComment
};
