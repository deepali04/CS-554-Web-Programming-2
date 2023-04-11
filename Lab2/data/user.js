const express = require('express');
const helper = require('../helpers');
const router = express.Router();
const data = require('../data');
const mongoCollections = require('../config/mongoCollections')
const users = mongoCollections.users;
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const {ObjectId} = require('mongodb');

const createUser = async ( name, username, password) => { 

  name= name.trim().toLowerCase();
  username=username.trim().toLowerCase();
  password=password;
  
  try{
    helper.nameErrorChecking(name);
    helper.userNameErrorChecking(username);
    helper.passwordErrorChecking(password);
  } catch (e) {
      throw e;
  }
  let userAuth = {insertedUser: false}

  const userCollection = await users();
  const isDuplicateUser = await userCollection.findOne({username: username});

  if(isDuplicateUser){
    throw {statusCode: 400, message: 'there is already a user with that username!'};
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  let newUser = {
    name: name,
    username: username,
    password: hashedPassword
  };

  const insertUser = await userCollection.insertOne(newUser);
  if(insertUser.insertedCount === 0){
    throw {statusCode: 500, message: 'Internal Server Error'};
  }

  const newuserId= insertUser.insertedId.toString();
  const user = await userCollection.findOne({ _id: new ObjectId(newuserId.toString()) });
  if (user === null)
    throw [404,"No user exists with this ID"];
  user._id = user._id.toString();
  return user;
};

const validateUser = async (username, password) => {
  username=username.trim().toLowerCase();
  password=password.trim();
  // try{
  //   helper.userNameErrorChecking(username);
  //   helper.passwordErrorChecking(password);
  // } catch (e) {
  //     throw e;
  // }
  const userCollection = await users();
  const user = await userCollection.findOne({username: username});
  
  if(!user){
    throw {statusCode: 404, message: "User Not Found!"};
  }
  
  let comparePassword = await bcrypt.compare(password, user.password);
  return comparePassword;
};

const getUserByUserName = async (username) => {

  const userCollection = await users();
  const userInfo = await userCollection.findOne({username: username});
  if (!userInfo) 
    throw {statusCode: 404, message: "User Not Found!"};
  return userInfo;
};


module.exports = {
  createUser,
  validateUser,
  getUserByUserName
};