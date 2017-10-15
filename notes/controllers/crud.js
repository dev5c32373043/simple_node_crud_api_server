module.exports = (Note)=>{
  let exists = (note, res, cb)=> note != null ? cb() : res.status(404).json({status: 'Note Not Found'})

  return{
    index:  (req, res)=>{
      Note.find((error, notes)=>{
        res.json(notes)
      })
    },
    show:   (req, res)=>{
      Note.findById(req.params.id, (error, note)=>{
        if(error) res.status(403).json({status: 'Forbidden'})
        else exists(note, res, ()=> res.json(note))
      })
    },
    create: (req, res)=>{
      let note = new Note(req.body);
      note.save((error, note)=>{
        error ? res.status(403).json({status: 'Forbidden'}) : res.status(201).json(note)
      })
    },
    update: (req, res)=>{
      Note.findById(req.params.id, (error, note)=>{
        if(error) res.status(403).json({status: 'Forbidden'})
        else{
          exists(note, res, ()=>{
            note.title = req.body.title || note.title
            note.text  = req.body.text  || note.text
            note.save((error, note)=>{
              error ? res.status(403).json({status: 'Forbidden'}) : res.json(note)
            })
          })
        }
      })
    },
    delete: (req, res)=>{
      Note.findByIdAndRemove(req.params.id, (error, note)=>{
        if(error) res.status(403).json({status: 'Forbidden'})
        else exists(note, res, ()=> res.json(note))
      })
    }
  }
}
