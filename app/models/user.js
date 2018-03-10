const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secretKey } = require(`${process.cwd()}/config`)[NODE_ENV];

const schema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      isAsync: true,
      validator: emailValidator
    }
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

function emailValidator(value, next) {
  let emailRegex = /^([\w-]+@([\w-]+\.)+[\w-]{2,4})?$/;

  this.model('User').count({ email: value }, (error, count) => {
    switch (true) {
      case error:
        next(error);
        break;
      case !!count:
        next(!count, 'User already exists');
        break;
      case !emailRegex.test(value):
        next(emailRegex.test(value), 'Email not correct');
        break;
      default:
        next();
    }
  });
}

schema.statics.generateHash = password =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, 8, (error, hash) => {
      if (error) reject(error);
      resolve(hash);
    });
  });

schema.methods.comparePassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (error, res) => {
      if (error) reject(error);
      resolve(res);
    });
  });
};

schema.methods.signJWT = function() {
  const payload = { id: this.id };
  return jwt.sign(payload, secretKey);
};

schema.post('validate', async function(doc, next) {
  if (doc.isNew) {
    doc.password = await this.model('User').generateHash(doc.password);
  }
  next();
});

module.exports = mongoose.model('User', schema);
