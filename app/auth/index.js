module.exports = (app, config)=>{
  const User = require('../models/user');
  const passport = require('passport');
  passport.use(require('./strategies/jwt')(User, config));
  app.use(passport.initialize());

  const controller = require('./controllers/auth')(User, config);
  const routes     = require('./routes')(app, controller);
}
