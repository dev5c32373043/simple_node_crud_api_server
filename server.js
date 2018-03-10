const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const bluebird = require('bluebird');
const app = express();
const config = require('./config');

global.NODE_ENV = process.env.NODE_ENV || 'development';
global.PORT = process.env.PORT || 3000;

global.Promise = bluebird;

mongoose.Promise = bluebird;

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'pickyDude');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (NODE_ENV !== 'test') app.use(require('./logger')());

passport.use(require('./app/features/auth/strategies/jwt')());
app.use(passport.initialize());

mongoose.connect(config[NODE_ENV].db, { useMongoClient: true });
const database = mongoose.connection;
database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', () => {
  app.use('/auth', require('./app/features/auth/router'));
  app.use('/notes', require('./app/features/notes/router'));

  if (NODE_ENV === 'production') return require('./clusterify')(app);

  app.listen(PORT, () => console.log(`node listen on ${PORT} port!`));
});

module.exports = app;
