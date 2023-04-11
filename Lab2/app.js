const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const redis = require("redis");
const redisClient = redis.createClient({ legacyMode: true });
const client= redis.createClient();
const connectRedis = require('connect-redis');

const configRoutes = require("./routes");
const { recipes } = require("./data");
const { getRecipeById } = require("./data/recipe");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
urlCount = {};

// app.use(session({
//   name: "AuthCookie",
//   secret: "secret-key",
//   saveUninitialized: true,
//   resave: false
// }));

(async () => {
  await redisClient.connect();
  await client.connect();
})();

const RedisStore = connectRedis(session);

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'ssssssshhh it is a secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie 
      maxAge: 1000 * 60 * 10 // session max age in miliseconds
  }
}));



//redis middle-wares start here
 
app.get('/recipes', async (req, res, next) => {
  const pageNo= req.query.page;
  //console.log(typeof(req.originalUrl))
  if (req.originalUrl.indexOf("?")===-1){
    let cacheCheck = await client.get("recipesPage1");
    if (cacheCheck) {
      console.log("cache hit!")
      return res.status(200).json(JSON.parse(cacheCheck));
    } else {
        console.log("cache miss!")
        next(); 
      }  
  } else{
    let cacheCheck = await client.get(`recipesPage${pageNo}`);
    if (cacheCheck) {
      console.log("cache hit!")
      return res.status(200).json(JSON.parse(cacheCheck));
    } else {
      console.log("cache miss!")
      next(); 
    }
  }

});


app.get('/recipes/:id', async (req, res, next) => {
	let cacheRecipeID = await client.get(`recipes:${req.params.id}`);
	if (cacheRecipeID) {
    console.log("cache hit!");
    await redisClient.ZINCRBY('recipeAccessCounts', 1, req.params.id);
		return res.status(200).json(JSON.parse(cacheRecipeID));
	} else { 
    console.log("cache miss!")
		next();   
	}
});

app.get('/mostaccessed', async (req, res, next) => {
  if(await client.exists('recipeAccessCounts')){
    let mostAccessedRecipes = await client.zRange('recipeAccessCounts', 0 , 9, {REV: true});
    console.log(mostAccessedRecipes)
	  if (mostAccessedRecipes) {
      let mostAccessedRecipesList=[]
      console.log("cache hit!");
      try {
        for(i in mostAccessedRecipes){
        mostAccessedRecipesList.push(await getRecipeById(mostAccessedRecipes[i]));
        }
      } catch(e){
          return res.status(404).json("Error: Access recipes first!!!"); 
      }
    return res.status(200).json(mostAccessedRecipesList);
	  } else{
        return res.status(404).json("Error: Access recipes first!!!"); 
    }
  } else { 
      return res.status(404).json("Error: Access recipes first!!!");
	}
});

//redis middle-wares End here

app.use('/signup', (req,res,next)=>{
  next();
});

app.use('/login', (req, res, next)=>{
  if (req.session.loginStatus)
    res.status(403).json({message: "You are already logged in!!!"})
  else
    next();
});

app.use('/logout', (req, res, next)=>{
  if (!req.session.loginStatus)
    res.status(403).json({message: "You are not logged in. You must be logged in before logging out!"})
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
  console.log("[" + timeStamp + "]:"+ " | URL PATH: ", req.originalUrl + " | HTTP METHOD or VERB:", req.method + " | No. of times URL requested: ", urlCount[data]);
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


