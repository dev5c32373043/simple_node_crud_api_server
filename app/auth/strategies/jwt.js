const passportJwt = require("passport-jwt");
const extractJwt  = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;

module.exports = (User, config)=>{
  const options = {}
  options.jwtFromRequest = extractJwt.fromAuthHeaderWithScheme('jwt');
  options.secretOrKey = config.secretKey;

  const strategy = new JwtStrategy(options, (jwt_payload, next)=> {
    console.log('payload received', jwt_payload);
    User.findById(jwt_payload.id, (error, user)=>{
      if(error) done(error, false)
      else user ? next(null, user) : next(null, false)
    })
  });

  return strategy;
}
