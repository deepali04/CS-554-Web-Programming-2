//require express, express router and bcrypt as shown in lecture code
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const data = require('../data');
const userData = data.users;
const helper = require('../helpers');

router.route('/signup').post(async (req, res) => {
  let requestData = req.body;
  try {
    helper.nameErrorChecking(requestData.name);
    helper.userNameErrorChecking(requestData.username);
    helper.passwordErrorChecking(requestData.password);
  } catch(e) {
      res.status(400).json(e);
      return;
  } 
  try{  
    let insertedUser = await userData.createUser(requestData.name, requestData.username, requestData.password);
    res.status(200).json(insertedUser);
  } catch(e) {
      res.status(400).json(e);
  }     
})
 
router.route('/login').post(async (req, res) => { 
  let requestData = req.body;
  username=requestData.username;
  try {
    helper.userNameErrorChecking(username.toLowerCase());
    helper.passwordErrorChecking(requestData.password);
  }
  catch(e) {
    res.status(400).json(e);
  }

  try{
    const isSuccess = await userData.validateUser(username, requestData.password);
    if(isSuccess) {
      const userInfo = await userData.getUserByUserName(username);
      //console.log(userInfo);
      req.session.cookie.maxAge = 600000;
      req.session.userDetails = {
        userAuthenticated: true,
        username: username,
        userId: userInfo._id
      };

      req.session.loginStatus= true;
      req.session.userObject= {
        id: userInfo._id,
        username: username
      };
      console.log(req.session.loginStatus);
      res.status(200).json({ _id: userInfo._id, name: userInfo.name, username: userInfo.username});  
    }   
    else {
      req.session.userDetails = {
        userAuthenticated: false
      }
      req.session.loginStatus= false;
      //console.log(req.session.loginStatus);
      res.status(400).json("Either Username or password is incorrect!");
    }   
  } catch(e) {
    res.status(500).json(e);
  }
})  

router.route('/logout').get(async (req, res) => {
  if (!req.session.loginStatus) {
    return res.status(403).json({ error: "User is not logged in, please login!"});
  }
  req.session.cookie.expires = new Date(Date.now());
  req.session.destroy();
  res.clearCookie('AuthCookie');
  res.status(200).json({message: "You have been successfully logged out!"});   
})
module.exports = router;