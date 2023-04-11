//Here you will require both data files and export them as shown in lecture code where there is more than one data file. Look at lecture 6 lecture code for example
const recipeData = require('./recipe');
const commentData = require('./comment');
const likeData = require('./likes');
const userData = require('./user');


module.exports = {
  recipes: recipeData,
  comments: commentData,
  likes: likeData,
  users: userData
};