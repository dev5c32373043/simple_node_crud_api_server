const { ExtractJwt, Strategy } = require('passport-jwt');
const { secretKey } = require(`${process.cwd()}/config`)[NODE_ENV];
const User = require('../../../models/user');

module.exports = () => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: secretKey
  };

  return new Strategy(options, (jwt_payload, next) => {
    User.findById(jwt_payload.id, (error, user) => {
      if (error) return next(error, false);
      user ? next(null, user) : next(null, false);
    });
  });
};
