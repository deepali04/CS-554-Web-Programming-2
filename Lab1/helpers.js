//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.

const { ObjectId } = require('mongodb');

function nullHandling(variable){
  if(!variable)
    throw "A null value has been provided, fix that";  
}

function stringTypeHandling(variable){
  if (!(typeof(variable)==='string'))
    throw "Please enter string values for fields";
}

function stringTypeHandling(variable){
  if (variable.trim().length===0)
    throw "Just empty spaces in the filed, pleas eprovide value";
}

function ObjectIDHandling(variable){
  if(!ObjectId.isValid(variable))
    throw "The ID is not a valid Object ID";  
}

function titleErrorChecking(title){
  if(!title) throw 'Provide a title';
  if(!(typeof(title)==='string')) throw 'Title should be a string';
  title=title.trim();
  if(title.length===0) throw 'Title can not be empty or just spaces';
  if(title.length<3) throw 'Title is too short, should be atleast 3 characters!';
  // var regEx = /^[a-zA-Z ]+$/;
  // if(!(title.match(regEx))) throw 'Verify Title, it should contain alphabets only';
}

function ingredientsErrorChecking(ingredients){
  if(!ingredients) throw 'Provide Ingredients';
  if(!(Array.isArray(ingredients))) throw 'Ingredients should be an Array';
  if(ingredients.length===0) throw 'Ingredients can not be empty';
  if(ingredients.length<3) throw 'Atleast 3 Ingredients are required for recipe!';
  ingredients.forEach(ingredient=>{
    if(!ingredient) throw 'Provide a value of Ingredient';
    if(!(typeof(ingredient)==='string')) throw 'Ingredient value should be a string';
    ingredient=ingredient.trim();
    if(ingredient.length===0) throw 'Ingredient value can not be empty or just spaces';
    if(ingredient.length<3 || ingredient.length>50)   throw 'Name of ingredient must be between 3 and 50 characters';
    // var regEx = /^[a-zA-Z0-9 ]+$/;
    // if(!(ingredient.match(regEx))) throw 'Ingredient should not contain special characters!!';
  });
}

function stepsErrorChecking(steps){
  if(!steps) throw 'Provide Steps';
  if(!(Array.isArray(steps))) throw 'Steps should be an Array';
  if(steps.length===0) throw 'Steps can not be empty';
  if(steps.length<5) throw 'Atleast 5 Steps are required for recipe!';
  steps.forEach(step=>{
    if(!step) throw 'Provide Step';
    if(!(typeof(step)==='string')) throw 'Step value should be a string';
    step=step.trim();
    if(step.length===0) throw 'Step value can not be empty or just spaces';
    if(step.length<20)   throw 'Step should be atleast 20 characters long!';
    // var regEx = /^[a-zA-Z0-9,/ ]+$/;
    // if(!(step.match(regEx))) throw 'Step is not in proper format';
  });
}

function cookingSkillRequiredErrorChecking(cookingSkillRequired){
  if(!cookingSkillRequired) throw 'Provide cookingSkillRequired';
  if(!(typeof(cookingSkillRequired)==='string')) throw 'cookingSkillRequired value should be a string';
  cookingSkillRequired=cookingSkillRequired.trim().toLowerCase();
  if(!(cookingSkillRequired==='novice' || cookingSkillRequired==='intermediate'|| cookingSkillRequired==='advanced'))
    throw ' Invalid cooking skill';
 }  

function nameErrorChecking(name){
  if(!name) throw 'Provide Name of the user';
  if(!(typeof(name)==='string')) throw 'Name should be a string';
  name=name.trim();
  if(name.length===0) throw 'Name can not be empty or just spaces'; 
  let nameArray=name.split(" ");
  if (!(nameArray.length===2)) throw 'Provide only first and last name of the user';
  nameArray.forEach(element => {
    if(element.length<3) throw 'First name or Last name of user should be atleast 3 character long';
    var regEx = /^[a-zA-Z /]+$/;
    if(!(element.match(regEx))) throw 'Verify Name, it should contain only alphabetic characters';    
  });
}



function userNameErrorChecking(username){
  if(!username) throw 'Provide Username';
  if(!(typeof(username)==='string')) throw 'Username should be a string';
  username=username.trim();
  if(username.length===0) throw 'Username can not be empty or just spaces'; 
  if(username.length<3)   throw 'Username Name is too short, should be atleast 3 characters long';
  //var regEx = /^[a-zA-Z0-9 ]+$/;
  var regEx = /^(?=.*[a-zA-Z])[a-zA-Z\d]+$/;
  if(!(username.match(regEx))) throw 'Verify Username, it should contain only alphanumeric characters';
}

function passwordErrorChecking(password){
  if(!password) throw 'Provide a Password';
  if(!(typeof(password)==='string')) throw 'Password should be a string';
  password=password.trim();
  if(password.length===0) throw 'password can not be empty or just spaces'; 
  if(password.length<6) throw 'The password should be 6 characters minimum';
  var validatePassword=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/;
  if(!validatePassword.test(password) || password.trim().length<6 ){
    throw {statusCode: 400, message: 'Password should be atleast 6 characters long and should follow contraints'};
  }
}

function commentErrorChecking(comment){
  if(!comment) throw 'Provide a Comment';
  if(!(typeof(comment)==='string')) throw 'comment should be a string';
  comment=comment.trim();
  if(comment.length===0) throw 'comment can not be empty or just spaces'; 
  if(comment.length<3) throw 'The comment should be 3 characters minimum';
  // var regEx = /^[a-zA-Z ]+$/;
  // if(!(password.match(regEx))) throw 'Verify comment, it should contain only alphabetic characters'; 
}


module.exports = {
  titleErrorChecking,
  ingredientsErrorChecking,
  stepsErrorChecking,
  cookingSkillRequiredErrorChecking,
  nameErrorChecking,
  userNameErrorChecking,
  passwordErrorChecking,
  commentErrorChecking,
  ObjectIDHandling,
  nullHandling,
  stringTypeHandling
};