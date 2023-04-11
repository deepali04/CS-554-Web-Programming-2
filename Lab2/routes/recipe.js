//require express and express router as shown in lecture code
const express = require('express');
const router = express.Router();
const data = require('../data');
const recipeData = data.recipes;
const {ObjectId} = require('mongodb');
const helper = require('../helpers');

const redis = require("redis");
const redisClient = redis.createClient();

(async () => {
  await redisClient.connect();
})();

router.route('/').get(async (req, res) => {
  try {
    let recipeList = await recipeData.getAllRecipes();

    //redis implementation here
    //await redisClient.set('recipesPage1', JSON.stringify(recipeList));

    //implementation of pagination here
    const page = req.query.page;
    const limit= 3;

    if(typeof(page)==='undefined' && limit>=recipeList.length){
      await redisClient.set('recipesPage1', JSON.stringify(recipeList));
      return res.status(200).json(recipeList);
    }

    
    if(typeof(page)==='undefined' && limit<recipeList.length){
      await redisClient.set('recipesPage1', JSON.stringify(recipeList.slice(1,limit+1)));
      return res.status(200).json(recipeList.slice(1,limit+1));
    }
  

    if(isNaN(parseInt(page)) || page<=0){
      return res.status(400).json('Provided page is not valid!');
    }

    const startIndex= (page-1)* limit;
    const endIndex= page * limit;
    const pageNo=(startIndex/limit)+1

    if(startIndex>recipeList.length){
      return res.status(404).json({ error: 'there are no more recipes' });
    }
    let paginatedRecipeList= recipeList.slice(startIndex, endIndex)
    await redisClient.set(`recipesPage${pageNo}`, JSON.stringify(recipeList.slice(1,limit+1)));
    return res.status(200).json(paginatedRecipeList);
  } catch (e) {
      console.log(e);
      return res.status(404).json({ error: 'No Recipe Found!' });
  }
});



router.route('/').post(async (req, res) => {
  if(!req.session.loginStatus)
    return res.status(403).json({message: "User is not logged in."});
  const recipeInfo = req.body;

  try{ 
    helper.titleErrorChecking(recipeInfo.title);
    helper.ingredientsErrorChecking(recipeInfo.ingredients);
    helper.stepsErrorChecking(recipeInfo.steps);
    helper.cookingSkillRequiredErrorChecking(recipeInfo.cookingSkillRequired); 

  } catch(e){
    console.log(e);
    res.status(400).json({ error: e }); 
    return;
  }
  try{
    let newRecipe = await recipeData.createRecipe(
      recipeInfo.title,
      recipeInfo.ingredients,
      recipeInfo.steps,
      recipeInfo.cookingSkillRequired,
      req.session.userObject
    );
    console.log(newRecipe._id);

    //redis implementation here
    await redisClient.set(`recipes:${newRecipe._id}`, JSON.stringify(newRecipe));
    await redisClient.ZINCRBY('recipeAccessCounts', 1, newRecipe._id);
    console.log('stored in the cache');

    res.json(newRecipe);
  } catch (e) {
    console.log(e);
    res.status(400).json({error: e});
    }
  });

router.route('/:id').get(async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({error: 'You must provide an ID'});
  }

  if (!req.params.id.trim().length===0) {
    return res.status(400).json({error: 'ID contains only empty spaces'});
  }

  if(!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'The ID provided is not a valid Object ID' });
  }

  try {
    let recipe = await recipeData.getRecipeById(req.params.id);
    await redisClient.set(`recipes:${req.params.id}`, JSON.stringify(recipe));
    await redisClient.ZINCRBY('recipeAccessCounts', 1, recipe._id);    

    res.status(200).json(recipe);
  } catch (e) {
    console.log(e)
    res.status(404).json({ error: 'Recipe not found' });
  }
});


router.route('/:id').patch(async (req, res) => {
  if(!req.session.loginStatus)
    return res.status(403).json({message: "User is not logged in."});

  if (!req.params.id) {
    return res.status(400).json({error: 'You must provide an ID'});
  }

  if (!req.params.id.trim().length===0) {
    return res.status(400).json({error: 'ID contains only empty spaces'});
  }

  if(!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'The ID provided is not a valid Object ID' });
  }

  let userCheck = await recipeData.checkUserforPatch(req.session.userDetails, req.params.id);

  if (userCheck === false) {
    return res.status(403).json({ error: "You don't have access to edit recipe!" });
  }

  let recipeObject={}
  let recipeInfo = req.body;

  const oldRecipe = await recipeData.getRecipeById(req.params.id);
  if(!oldRecipe){
    return res.status(404).json('Recipe not Found!');
  }

  if (recipeInfo.title){
    if (recipeInfo.title !== oldRecipe.title)
      recipeObject.title = recipeInfo.title;
  } 

  if (recipeInfo.ingredients){
    if(!(JSON.stringify(recipeInfo.ingredients) === JSON.stringify(oldRecipe.ingredients)))
    recipeObject.ingredients = recipeInfo.ingredients;
  } 
    
  if (recipeInfo.steps){
    if(!(JSON.stringify(recipeInfo.steps) === JSON.stringify(oldRecipe.steps)))
      recipeObject.steps = recipeInfo.steps;
  } 

  if (recipeInfo.cookingSkillRequired){
    if(recipeInfo.cookingSkillRequired.toLowerCase() !== oldRecipe.cookingSkillRequired.toLowerCase())
      recipeObject.cookingSkillRequired = recipeInfo.cookingSkillRequired;
  }
  if (Object.keys(recipeObject).length !== 0) {
    try {
      const updatedRecipe = await recipeData.updateRecipe(req.params.id, recipeObject);

      if(await redisClient.exists(`recipes:${req.params.id}`)){
        await redisClient.set(`recipes:${req.params.id}`, JSON.stringify(updatedRecipe));
        await redisClient.ZINCRBY('recipeAccessCounts', 1, updatedRecipe._id);         
        console.log('Updated in the cache');
      }

      return res.status(200).json(updatedRecipe);
    } catch (e) {
      console.log(e)
      return res.status(500).json({ error: e });
    }
  } else {
    return res.status(400).json({
      error:"No fields have been changed from their inital values, so no update has occurred!",
    });
  }
});

module.exports = router;
