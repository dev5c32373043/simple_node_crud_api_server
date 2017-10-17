class CRUDController{
  constructor(Note){
    this.Note = Note
    this.exists = (note, res, cb)=> note != null ? cb() : res.status(404).json({status: 'Note Not Found'})
  }

  index(req, res){
    this.Note.find((error, notes)=>{
      res.json(notes)
    })
  }

  show(req, res){
    this.Note.findById(req.params.id, (error, note)=>{
      if(error) res.status(403).json({status: 'Forbidden'})
      else this.exists(note, res, ()=> res.json(note))
    })
  }

  create(req, res){
    let note = new this.Note(req.body);
    note.save((error, note)=>{
      error ? res.status(403).json({status: 'Forbidden'}) : res.status(201).json(note)
    })
  }

  update(req, res){
    this.Note.findById(req.params.id, (error, note)=>{
      if(error) res.status(403).json({status: 'Forbidden'})
      else{
        this.exists(note, res, ()=>{
          note.title = req.body.title || note.title
          note.text  = req.body.text  || note.text
          note.save((error, note)=>{
            error ? res.status(403).json({status: 'Forbidden'}) : res.json(note)
          })
        })
      }
    })
  }

  delete(req, res){
    this.Note.findByIdAndRemove(req.params.id, (error, note)=>{
      if(error) res.status(403).json({status: 'Forbidden'})
      else this.exists(note, res, ()=> res.json(note))
    })
  }
}

module.exports = (Note)=> new CRUDController(Note)
