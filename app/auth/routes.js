module.exports = (app, controller)=>{
  app.post('/auth/authorize',     (req, res)=> controller.authorize(req, res))

  app.post('/auth/registration',  (req, res)=> controller.registration(req, res))
}
