const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
const {ObjectId} = require('mongodb');
const helper = require('../helpers');
const recipes = mongoCollections.recipes;

const createRecipe = async (title, ingredients, steps, cookingSkillRequired, user) => {

try {
  helper.titleErrorChecking(title);
  helper.ingredientsErrorChecking(ingredients);
  helper.stepsErrorChecking(steps);
  helper.cookingSkillRequiredErrorChecking(cookingSkillRequired);
} catch (e) {
    //console.log("data 15");
    throw e;
}

title=title.trim();
cookingSkillRequired=cookingSkillRequired.trim();

ingredients = ingredients.map(element => {
  return element.trim();
});

steps = steps.map(element => {
  return element.trim(); 
});

const recipeCollection = await recipes();
let newRecipe = {
  title: title,
  ingredients: ingredients,
  cookingSkillRequired: cookingSkillRequired,
  steps: steps,  
  userThatPosted: user,
  comments:[],
  likes: []
  }

  const insertInfo = await recipeCollection.insertOne(newRecipe);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
  throw [500, "Could not add new Recipe"];

  const newId = insertInfo.insertedId.toString();
  const recipe = await getRecipeById(newId.toString());
  return recipe;
};

const getAllRecipes = async () => {

  const recipeCollection= await recipes();
  const recipeList = await recipeCollection.find({}).toArray();
  if (!recipeList) 
    throw [404, "No Recipe Found!"];
  return recipeList;
};

const getRecipeById = async (recipeId) => {
  if (!recipeId)
    throw [400,"You must provide an ID"];
  if (typeof recipeId !== 'string' || recipeId.trim().length===0)
    throw [400,"Please provide a valid ID"];
  if(!ObjectId.isValid(recipeId))
    throw [400,"The ID is not a valid Object ID"];

  const recipeCollection = await recipes();
  const recipe = await recipeCollection.findOne({ _id: new ObjectId(recipeId) });
  if (recipe === null)
    throw [404,"No recipe exists with this ID"];
  recipe._id = recipe._id.toString();
  return recipe;
};

const updateRecipe = async (id, updateRecipeData) => {
  
  if (!id || typeof(id)!== "string" || id === undefined || id=== null) 
    throw [400, "You must provide an id to search for"];
  
  const recipeCollection = await recipes();
  const oldRecipe = await getRecipeById(id);
  console.log(oldRecipe)

  let modifiedRecipe = {};

  modifiedRecipe.likes = oldRecipe.likes;
  modifiedRecipe.userThatPosted = oldRecipe.userThatPosted;

  if (updateRecipeData.title && oldRecipe.title!==updateRecipeData.title) 
    modifiedRecipe.title = updateRecipeData.title
  else
    modifiedRecipe.title = oldRecipe.title

  if (updateRecipeData.cookingSkillRequired && oldRecipe.cookingSkillRequired!== updateRecipeData.cookingSkillRequired)
    modifiedRecipe.cookingSkillRequired = updateRecipeData.cookingSkillRequired;
  else
    modifiedRecipe.cookingSkillRequired = oldRecipe.cookingSkillRequired;

  if (updateRecipeData.ingredients && oldRecipe.ingredients!== updateRecipeData.ingredients)
    modifiedRecipe.ingredients = updateRecipeData.ingredients;
  else
    modifiedRecipe.ingredients = oldRecipe.ingredients;

  if (updateRecipeData.steps && oldRecipe.steps!== updateRecipeData.steps)
    modifiedRecipe.steps = updateRecipeData.steps;
  else
    modifiedRecipe.steps = oldRecipe.steps;

  const successfullyUpdated = await recipeCollection.updateOne(
    {_id: new ObjectId(id)},
    {$set: modifiedRecipe}
  )

  if(!successfullyUpdated.matchedCount && !successfullyUpdated.modifiedCount)
    throw [500, "Update of the Recipe has been failed"];
  return await getRecipeById(id);
  };

  const checkUserforPatch = async (updateRecipeData, id) => {
		let recipe = await getRecipeById(id.toString());
		if (updateRecipeData.username === recipe.userThatPosted.username) 
			return true;
		return false;
	};


  module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  checkUserforPatch
};
