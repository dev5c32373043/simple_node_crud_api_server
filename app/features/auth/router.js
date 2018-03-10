const authRouter = require('express').Router();
const User = require('../../models/user');

const required = res =>
  res.status(403).json({ message: 'email and password required!' });

const unauthorized = res =>
  res.status(401).json({ message: 'wrong email or password' });

authRouter.post('/sign_in', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return required(res);
  User.findOne({ email: email }, (error, user) => {
    if (error) return res.status(500).send(error);
    if (!user) return unauthorized(res);
    user.comparePassword(password).then(valid => {
      if (!valid) return unauthorized(res);
      res.json({ token: user.signJWT() });
    });
  });
});

authRouter.post('/sign_up', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return required(res);
  new User({
    email,
    password
  }).save((error, user) => {
    if (error) return res.status(403).send(error);
    res.status(201).json({ token: user.signJWT() });
  });
});

module.exports = authRouter;
