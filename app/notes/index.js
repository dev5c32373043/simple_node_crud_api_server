module.exports = (app)=>{
  const Note       = require('../models/note');
  const controller = require('./controllers/crud')(Note);
  const routes     = require('./routes')(app, controller);
}
