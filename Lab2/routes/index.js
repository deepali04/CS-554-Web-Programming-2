//Here you will require both route files and export the constructor method as shown in lecture code where there is more than one route file. Look at lecture 6 lecture code for example
// when the route is /movies use the routes defined in movies.js routing file, when the route is /reviews use the routes defined in reviews.js routing file, all other enpoints should return a 404 as shown in the lecture code.

const recipeRoutes = require('./recipe');
const commentRoutes = require('./comment');
const likeRoutes = require('./likes');
const userRoute = require('./user');

const constructorMethod = (app) => {
  app.use('/recipes', recipeRoutes);
  app.use('/recipes', commentRoutes);
  app.use('/recipes', likeRoutes);
  app.use(userRoute);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
