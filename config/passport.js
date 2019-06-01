const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;


const mongoose = require("mongoose");

//引入用户模型
require('../models/userarr')
const userarr=mongoose.model('userarr') 

//配置信息
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'books';  //加密名字

module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    //return done(null,jwt_payload)
    //验证是否通过,返回解密后的(加密)内容
   
     //console.log(jwt_payload);
    
    //然后 通过验证用户数据库，获取该用户的详细信息
     userarr.findById(jwt_payload.id,{passwords:0})
         .then(user => {
           if(user){
             return done(null,user);
           }

           return done(null,false);
         })
         .catch(err => console.log(err));
  }));
}