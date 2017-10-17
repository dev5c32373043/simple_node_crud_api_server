const mongoose = require('mongoose');

// secretToken: {
//   type: String,
//   default: buffer.toString('hex')
// },
// require('crypto').randomBytes(48, (err, buffer)=> {

const schema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
  
module.exports = mongoose.model('User', schema);
