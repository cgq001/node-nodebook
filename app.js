const express = require('express');
const app = express();
const  passport = require('passport')
const path = require('path');
const bodyParser = require('body-parser');
//配置静态资源目录：
app.use(express.static(path.join(__dirname, 'public')))     
const port = 5005;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// 初始化passport
app.use(passport.initialize());

require("./config/passport")(passport);
//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Authorization");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
// 引入新博客 后台API路由
const yuekeadmin = require('./router/yuekeadmin.js');

// 引入新博客 前端API路由
const yueke = require('./router/yueke.js');
// 使用新博客后台API路由
app.use('/bookadmin',yuekeadmin);
// 使用新博客后台API路由
app.use('/book',yueke);

app.listen(port,()=>{
	console.log('服务器开启')
});

