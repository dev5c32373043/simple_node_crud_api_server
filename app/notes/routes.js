const passport = require('passport');

module.exports = (app, controller)=>{
  app.get('/notes',        passport.authenticate('jwt', { session: false }), (req, res)=> controller.index(req, res))

  app.get('/notes/:id',    passport.authenticate('jwt', { session: false }), (req, res)=> controller.show(req, res))

  app.post('/notes',       passport.authenticate('jwt', { session: false }), (req, res)=> controller.create(req, res))

  app.patch('/notes/:id',  passport.authenticate('jwt', { session: false }), (req, res)=> controller.update(req, res))

  app.delete('/notes/:id', passport.authenticate('jwt', { session: false }), (req, res)=> controller.delete(req, res))
}
