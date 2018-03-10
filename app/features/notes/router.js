const noteRouter = require('express').Router();
const passport = require('passport');
const Note = require('../../models/note');

const notFound = res => res.status(404).json({ message: 'note not found' });

noteRouter.use(passport.authenticate('jwt', { session: false }));

noteRouter.get('/', (req, res) => {
  Note.find({ owner: req.user._id }, (error, notes) => {
    if (error) return res.status(500).json(error);
    res.json(notes);
  });
});

noteRouter.get('/:id', (req, res) => {
  Note.findOne({ owner: req.user._id, _id: req.params.id }, (error, note) => {
    if (!note) return notFound(res);
    if (error) return res.status(403).json(error);
    res.json(note);
  });
});

noteRouter.post('/', (req, res) => {
  const { title, text } = req.body;
  new Note({ title, text, owner: req.user._id }).save((error, note) => {
    error ? res.status(403).json(error) : res.status(201).json(note);
  });
});

noteRouter.patch('/:id', (req, res) => {
  const { title, text } = req.body;
  Note.findOne({ owner: req.user._id, _id: req.params.id }, (error, note) => {
    if (!note) return notFound(res);
    if (error) return res.status(403).json(error);
    note.title = title || note.title;
    note.text = text || note.text;
    note.save((error, note) => {
      error ? res.status(403).json(error) : res.json(note);
    });
  });
});

noteRouter.delete('/:id', (req, res) => {
  Note.findOneAndRemove({ owner: req.user._id, _id: req.params.id }, error => {
    if (error) return res.status(403).json(error);
    res.json({ message: 'ok' });
  });
});

module.exports = noteRouter;
