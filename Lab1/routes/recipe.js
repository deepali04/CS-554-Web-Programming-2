//require express and express router as shown in lecture code
const express = require('express');
const router = express.Router();
const data = require('../data');
const recipeData = data.recipes;
const {ObjectId} = require('mongodb');
const helper = require('../helpers');

router.route('/').get(async (req, res) => {
  try {
    let recipeList = await recipeData.getAllRecipes();

    //implementation of pagination here
    const page = req.query.page;
    const limit= 50;

    if(typeof(page)==='undefined' && limit>=recipeList.length)
      return res.status(200).json(recipeList);
    
    if(typeof(page)==='undefined' && limit<recipeList.length)
    return res.status(200).json(recipeList.slice(1,limit+1));

    if(isNaN(parseInt(page)) || page<=0){
      return res.status(400).json('Provided page is not valid!');
    }

    const startIndex= (page-1)* limit;
    const endIndex= page * limit;

    if(startIndex>recipeList.length){
      return res.status(404).json({ error: 'there are no more recipes' });
    }

    let paginatedRecipeList= recipeList.slice(startIndex, endIndex)
    return res.status(200).json(paginatedRecipeList);
  } catch (e) {
      // console.log(e);
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
    //console.log("route 30");
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
    res.json(newRecipe);
  } catch (e) {
    //console.log("route 43");
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
    res.status(200).json(recipe);
  } catch (e) {
    res.status(404).json({ error: 'Recipe not found' });
  }
});

router.route('/:id').patch(async (req, res) => {
  if(!req.session.loginStatus)
    return res.status(403).json({message: "User is not logged in."});

  let userCheck = await recipeData.checkUserforPatch(req.session.userDetails, req.params.id);
  //console.log(userCheck);

  if (userCheck === false) {
    return res.status(403).json({ error: "You don't have access to edit recipe!" });
  }

  let recipeObject={}
  let recipeInfo = req.body;

  try{ 
    helper.titleErrorChecking(recipeInfo.title);
    helper.ingredientsErrorChecking(recipeInfo.ingredients);
    helper.stepsErrorChecking(recipeInfo.steps);
    helper.cookingSkillRequiredErrorChecking(recipeInfo.cookingSkillRequired); 

  } catch(e){
    return res.status(400).json({ error: e });
  }

  const oldRecipe = await recipeData.getRecipeById(req.params.id);
  if(!oldRecipe){
    return res.status(404).json('Recipe not Found!');
  }

  if (recipeInfo.title && recipeInfo.title !== oldRecipe.title)
    recipeObject.title = recipeInfo.title;

  if (recipeInfo.ingredients && !(await recipeData.compareArrays(recipeInfo.ingredients, oldRecipe.ingredients)))
    recipeObject.ingredients = recipeInfo.ingredients;
  
  if (recipeInfo.steps && !(await recipeData.compareArrays(recipeInfo.steps, oldRecipe.steps)))
    recipeObject.steps = recipeInfo.steps;

  if (recipeInfo.cookingSkillRequired && recipeInfo.cookingSkillRequired !== oldRecipe.cookingSkillRequired)
    recipeObject.cookingSkillRequired = recipeInfo.cookingSkillRequired;
  
  if (Object.keys(recipeObject).length !== 0) {
    try {
      const updatedRecipe = await recipeData.updateRecipe(req.params.id, recipeObject);
      return res.json(updatedRecipe);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  } else {
    return res.status(400).json({
      error:"No fields have been changed from their inital values, so no update has occurred!",
    });
  }
});

      module.exports = router;
