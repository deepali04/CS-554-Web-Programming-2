const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const configRoutes = require("./routes");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
urlCount = {};

app.use(session({
  name: "AuthCookie",
  secret: "secret-key",
  saveUninitialized: true,
  resave: false
}));


//middlewares here

// app.user('/recipe', (req,res,next)=>{
//   if(req.session.loginStatus){
//       next();
//   }else{
//       return res.status(403).json({message: "User is not logged in, Login First!"});
//   }
// });

// app.patuserch('/recipe/:id', (req,res,next)=>{
//   if(req.session.loginStatus){
//       next();
//   }else{
//       return res.status(403).json({message: "User is not logged in, Login First!"});
//   }
// });

//check here
app.use('/signup', (req,res,next)=>{
  next();
});

app.use('/login', (req, res, next)=>{
  if (req.session.loginStatus)
    res.status(400).json({message: "You are already logged in!!!"})
  else
    next();
});

app.use('/logout', (req, res, next)=>{
  if (!req.session.loginStatus)
    res.status(400).json({message: "You are not logged in. You must be logged in before logging out!"})
  else
    next();
});

app.post('/recipe/:id/comments', (req,res,next)=>{
  if(req.session.loginStatus){
      next();
  }else{
      return res.status(403).json({message: "User is not logged in!"});
  }
});

app.delete('/recipe/:id/:commentId', (req,res,next)=>{
  if(req.session.loginStatus){
      next();
  }else{
      return res.status(403).json({message: "User is not logged in!"});
  }
});

app.use(async(req, res, next) => {
  let timeStamp = new Date().toUTCString();
  let authenticatedUser = "(Non-Authenticated User)";

  if(req.session.user)
    authenticatedUser = "(Authenticated User)";

  console.log("[" + timeStamp + "]:", req.method, req.originalUrl, authenticatedUser);
  next();
})

app.use((req, res, next) =>{
  let data = req.path+req.method
  let timeStamp = new Date().toUTCString();
  if(!urlCount[data]) urlCount[data] = 0
  urlCount[data]+=1;
  console.log("[" + timeStamp + "]:"+ " | URL PATH: ",req.originalUrl + " | HTTP METHOD or VERB:",req.method + " | No. of times URL requested: ",urlCount[data]);
  next();
});

app.use((req, res, next) =>{
  if(req.body){
    if(req.body.password){
      let{password, ...dataFromConsole}= req.body
      console.log(dataFromConsole);
    }
    else{
      console.log(req.body);
    }
  }
  else{
    console.log({});
  }
  next();
});

configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log("Your routes will be running on http://localhost:3000");
});


