const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

class AuthController{
  constructor(User, config){
    this.User = User
    this.config = config
  }

  authorize(req, res){
    if(req.body.email && req.body.password){
      let email = req.body.email;
      let password = req.body.password;
      this.User.findOne({email: email}, (error, user)=>{
        if(error) res.status(500).send(error)
        else{
          if(!user) res.status(401).json({message:"wrong email or password"})
          else{
            if(bcrypt.compareSync(password, user.password)){
              let payload = {id: user.id};
              let token = jwt.sign(payload, this.config.secretKey);
              res.json({message: "ok", token: token});
            }else res.status(401).json({message:"wrong email or password"})
          }
        }
      })
    }else{
      res.status(403).json({message: 'email and password required!'})
    }
  }
  registration(req, res){
    if(req.body.email && req.body.password){
      let email = req.body.email;
      let password = req.body.password;
      this.User.findOne({email: email}, (error, user)=>{
        if(error) res.status(500).send(error)
        else{
          if(user) res.status(403).json({message:"user already exists!"})
          else{
            let user = new User({email: email, password: bcrypt.hashSync(password, 8)})
            user.save((error, user)=>{
              if(error) res.status(500).send(error)
              else{
                let payload = {id: user.id};
                let token = jwt.sign(payload, this.config.secretKey);
                res.json({message: "ok", token: token});
              }
            })
          }
        }
      })
    }else{
      res.status(403).json({message: 'email and password required!'})
    }
  }
}

module.exports =  (User, config) => new AuthController(User, config)
