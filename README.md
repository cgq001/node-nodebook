# nuxt-admin

## 初始化
```
cnpm install
```

### Compiles and hot-reloads for development
```
nodemon app
```
##  跨域设置
````
//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
//添加自定义请求头Authorization
res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
````
##  MongoDB数据库
####  1、连接MongODB数据库
	//连接MongODB数据库
	const mongoose=require('mongoose')
	mongoose.connect("mongodb://127.0.0.1/book",{useNewUrlParser:true},function(err){
		if (err) {
			console.log('连接失败')
		}else{
			console.log('连接成功')
		}
	})
####  2、引入字符集模型
	//引入分类模型
	require('../models/text')
	const texts=mongoose.model('textstr')
####  3、创建字符集
	const mongoose=require('mongoose')
	// 文章列表 建模
	const Schema=mongoose.Schema;
	const IdeaSchema=new Schema({
	    name:{   //文章标题
	        type:String,
	        required:true
	    },
	    data:{  //创作时间
	        type:Date,
	        default:Date.now
	    }
	})
	//创建模型
	module.exports=mongoose.model('textstr',IdeaSchema) //'ideas' 集合名字
#### 4、MongoDB根据某字段查询，并排除返回某一项
	//查询 type=str 的数据，并排除 int、type、txs 项，则为0，只显示某一项 则为1
	texts.find({type:str},{int:0,txs:0,type:0})  
	        .sort({_id:-1})//根据data字段倒叙，1为正序，-1为倒叙
	        .limit(NumStr)
	        .skip(NumBers)  
	        .then(ideas=>{
	            //取出的数据为ideas
	           // console.log(ideas);
	            res.json({
	            	code:'0',
	            	data:ideas
	            })
	        })
#### 5、MongoDB 查询数组字段中是否包含某一项
	texts.find({"checkedA":{$all:[user]}},{introduction:0,tx:0})
        .sort({_id:-1})//根据data字段倒叙
        .limit(NumStr)
        .skip(NumBers)  
        .then(ideas=>{
            //取出的数据为ideas
           // console.log(ideas);
            res.json({
            	code:'0',
            	data:ideas
            })
        })
####  6、模糊查询
	texts.find({types:str,"txts":{$regex: strArr, $options:'i'}},{tx:0,types:0})
##  加密模块：
	cnpm install bcrypt -S
	 //加密模块      
	const bcrypt = require('bcrypt')
	//加密
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(要加密的内容, salt, function(err, hash) {
	    		hash 既为加密后的内容
	    	})
	 })
    //验证密码是否正确
    bcrypt.compare(前端密码, 数据库密码, function(err, res) {
    // res == true
	});
##  Token
	npm install jsonwebtoken  //设置token：
	npm install passport passport-jwt   //验证Token
	***
	//设置token：
	let jwt = require('jsonwebtoken');  //设置Token
	// 验证Token是否过期
	let  passport = require('passport')  //验证Token
	***
#### app.js
	const  passport = require('passport')
	// 初始化passport
	app.use(passport.initialize());	
	//配置文件
	require("./config/passport")(passport);
#### passport.js
	const JwtStrategy = require('passport-jwt').Strategy,
	      ExtractJwt = require('passport-jwt').ExtractJwt;
	 //数据库
	const mongoose = require("mongoose");
	//用户模型
	const User=mongoose.model('userarr')  
	//
	//配置信息
	const opts = {}
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = 'books';  //加密名字
	//
	module.exports = passport => {
		验证：
	  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
	    // console.log(jwt_payload);//验证是否通过,返回解密后的(加密)内容
	    //然后 通过验证 用户 数据库，获取该用户的详细信息
	     User.findById(jwt_payload.id,{password:0}) //排除密码
	         .then(user => {
	           if(user){
	             return done(null,user);
	           }
	           return done(null,false);
	         })
	         .catch(err => console.log(err));
	  }));
	}
#### Router路由文件：
	//设置token：
	// jwt.sign('规则','加密名字','过期时间','箭头函数')
	const rules={id:'123456',name:'cuiqiang'} //规则
			expiresIn  //过期时间，单位可以为 h(小时)
	jwt.sign(rules,'books',{expiresIn:50},(err,token)=>{
		if (err) throw err;
		res.json({
				code:'0',
				token:"Bearer "+token   //这里返回的Token必须以“Bearer ”开头
			})
	})
	***
	//验证
	const  passport = require('passport')
	// 验证Token是否过期
	routers.get('/tokenTime',passport.authenticate('jwt',{session:false}),(req,res)=>{
		res.json({
			msg:req.user  //获取passport.js返回的用户信息
		})
	})
