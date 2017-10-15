const express     = require('express');
const mongoose    = require('mongoose');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const app         = express();
const config      = require('./config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

mongoose.connect(config.db)
const database = mongoose.connection;
database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', ()=>{
  require('./notes/index')(app);
  app.listen(3000, ()=> console.log('Express listening on port 3000!'));
});
