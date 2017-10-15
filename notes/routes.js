module.exports = (app, controller)=>{
  app.get('/notes',        (req, res)=> controller.index(req, res))

  app.get('/notes/:id',    (req, res)=> controller.show(req, res))

  app.post('/notes',       (req, res)=> controller.create(req, res))

  app.patch('/notes/:id',  (req, res)=> controller.update(req, res))

  app.delete('/notes/:id', (req, res)=> controller.delete(req, res))
}
