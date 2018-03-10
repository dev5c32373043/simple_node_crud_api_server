const mongoose = require('mongoose');
const schema = mongoose.Schema({
  owner: {
    type: String,
    required: [true, 'owner required!']
  },
  title: {
    type: String,
    required: [true, 'title required!']
  },
  text: {
    type: String,
    required: [true, 'text required!']
  }
});

module.exports = mongoose.model('Note', schema);
