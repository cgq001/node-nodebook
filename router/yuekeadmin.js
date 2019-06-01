const express  = require('express');

const routers= express.Router();


//获取图片等文件
var formidable = require('formidable');
//文件路径
const path= require('path')
//文件管理
const fs= require('fs')

//token
let jwt = require('jsonwebtoken');
// 验证Token
let  passport = require('passport')

//连接MongODB数据库
// const mongoose=require('mongoose')
// mongoose.connect("mongodb://127.0.0.1/books",{useNewUrlParser:true},function(err){
// 	if (err) {
// 		console.log('连接失败')
// 	}else{
// 		console.log('连接成功')
// 	}
// })
const mongoose=require('../config/mongooses.js')
 //加密模块      
const bcrypt = require('bcrypt')

//引入分类模型
require('../models/clslist')
const clslist=mongoose.model('clslist')
//引入分类模型
require('../models/tables')
const tables=mongoose.model('tables')
//引入分类模型
require('../models/texts')
const texts=mongoose.model('texts')
//引入用户模型
require('../models/userarr')
const userarr=mongoose.model('userarr')
//引入关于本站模型
require('../models/abouts')
const abouts=mongoose.model('abouts')
//引入关于本站模型
require('../models/allcase')
const allcase=mongoose.model('allcase')
//引入评论模型
require('../models/commonts')
const commonts=mongoose.model('commonts')
// 登陆token测试API
routers.get('/',(req,res)=>{
	// jwt.sign('规则','加密名字','过期时间','箭头函数')
	const rules={id:'123456',name:'cuiqiang'} //规则

	jwt.sign(rules,'books',{expiresIn:50},(err,token)=>{
		if (err) throw err;
		res.json({
				code:'0',
				token:"Bearer "+token
			})
	})
})
// 验证Token是否过期
routers.get('/tokenTime',passport.authenticate('jwt',{session:false}),(req,res)=>{
	
	res.json({
		msg:req.user
	})
	//请求头设置：Authorization:Token
})
// 验证Token是否过期
routers.get('/tokenTimes',(req,res,next)=>{
	// psssport.authenticate('local',{
	// 	successRedirect:'ideas',  //成功 的跳转
	// 	failureRedirect: '/load',  //失败的跳转
	// 	failureFlash:true
	// })(req,res,next)

	res.json({
		msg:'success'
	})
})
// 图片上传API
routers.all('/src-imgs',(req,res)=>{
	let avatarName =''
	let form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = path.join(__dirname + "/../public/imgs"); //要保存的文件路径
        form.keepExtensions = true;//保留后缀
        form.maxFieldsSize = 6 * 1024 * 1024; // 6M
        form.parse(req, function (err, fields, filesa){
	        //console.log(files);
	        let files=filesa.imgstr  //给上传文件起的名字
	       // console.log(files);

	        if (files!=undefined) {
	        	//console.log(files);
	        	
	        	let filename = files.name
	        	let nameArray = filename.split('.');
	        	let type = nameArray[nameArray.length - 1];
	        	let name = '';
	        	for (var i = 0; i < nameArray.length - 1; i++) {
		            name = name + nameArray[i];   //获取文件名字
		        }
		        let nums=parseInt(Math.random()*1000)
		        let date = new Date();
		        let time = '_' + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes()+'_'+nums;
		        	avatarName = name + time + '.' + type;  //对文件进行重命名
		        let newPath = form.uploadDir + "/" + avatarName;
		        fs.renameSync(files.path, newPath);  //重命名
		         
		         
	        }
	        
	       	res.send({url:"http://127.0.0.1:5005/imgs/"+avatarName})   //返回文件里就
	        //console.log(avatarName);
    	})
        
})
// 图片上传API
routers.all('/srcImgsMarkDown',(req,res)=>{
	let avatarName =''
	let form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = path.join(__dirname + "/../public/imgs"); //要保存的文件路径
        form.keepExtensions = true;//保留后缀
        form.maxFieldsSize = 6 * 1024 * 1024; // 6M
        form.parse(req, function (err, fields, filesa){
	        
	        let files=filesa.image  //给上传文件起的名字
	       // console.log(files);

	        if (files!=undefined) {
	        	//console.log(files);
	        	
	        	let filename = files.name
	        	let nameArray = filename.split('.');
	        	let type = nameArray[nameArray.length - 1];
	        	let name = '';
	        	for (let i = 0; i < nameArray.length - 1; i++) {
		            name = name + nameArray[i];   //获取文件名字
		        }
		        let nums=parseInt(Math.random()*1000)
		        let date = new Date();
		        let time = '_' + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes()+'_'+nums;
		        	avatarName = name + time + '.' + type;  //对文件进行重命名
		        let newPath = form.uploadDir + "/" + avatarName;
		        fs.renameSync(files.path, newPath);  //重命名
		         
		         
	        }
	        
	       	res.send({url:"http://127.0.0.1:5005/imgs/"+avatarName})   //返回文件里就
	        //console.log(avatarName);
    	})
        
})
// 新增用户
routers.post('/adduser',(req,res)=>{
	 //console.log(req.body);
	let strArr=req.body
	let str={}
		str.users=strArr.users
		str.name=strArr.name
		str.passwords=strArr.passwords
		str.desc=strArr.desc
		if(strArr.numbers=='805696667'){
				bcrypt.genSalt(10, function(err, salt) {
				    bcrypt.hash(str.passwords, salt, function(err, hash) {
				        // Store hash in your password DB.
				        	str.passwords=hash
				       		new userarr(str)
								    .save()
								    .then(ides=>{
								    	//console.log(ides)
								        //存储成功
								        res.json({
											code:'0',
											date:ides
										})
								    }).catch(error=>{
								    	 res.json({
											code:'1'
										})
								    })
					    });
					})
			}else{
				res.json({
					code:'2'
					})
			}


})

// 查询用户名是否存在
routers.post('/searchNames',(req,res)=>{
	 
	 let str=req.body.name
	userarr.findOne({name:str})
			.countDocuments()
	        .then(ideas=>{
	            //取出的数据为ideas
	           
	            res.json({
	            	code:'0',
	            	data:ideas
	            })
	        }).catch(error=>{
	        	//console.log('错了')
	        })
})
// 登陆
routers.post('/loadUser',(req,res)=>{
	 
	 let str=req.body

	 //console.log(str);
	userarr.findOne({name:str.name},{passwords:1,_id:1})
	        .then(ideas=>{
	            //取出的数据为ideas
	            //console.log(ideas);
	          if(!ideas){
	          		res.json({
				        code:'1',
				        data:"ideas"
				  })
	          		return;
	          }
	           bcrypt.compare(str.passwords, ideas.passwords, function(err, resA) {
				    // res == true
				   // console.log(resA);
					    if(resA == true){
					    	// jwt.sign('规则','加密名字','过期时间','箭头函数')
								const rules={id:ideas._id} //规则
								let Times='4h';
								if (str.checked) {
									Times='168h';
									}
								jwt.sign(rules,'books',{expiresIn:Times},(err,token)=>{
									if (err) throw err;
									res.json({
											code:'0',
											data:"Bearer "+token
										})
								})
					    }else{
					    	res.json({
				            	code:'1',
				            	data:"ideas"
				            })
					    }
					});
	            
	        }).catch(error=>{
	        	res.json({
				        code:'1',
				        data:"ideas"
				  })
	        	console.log('错了')
	        })
})

// 查询所有用户
routers.post('/allNames',(req,res)=>{
	userarr.find({},{passwords:0,emails:0,desc:0,name:0})
	        .then(ideas=>{
	            //取出的数据为ideas
	           
	            res.json({
	            	code:'0',
	            	data:ideas
	            })
	        }).catch(error=>{
	        	console.log('错了')
	        })
})
// 删除用户
routers.post('/removeNames',(req,res)=>{
	let userid=req.body.userid
	//findOneAndDelete
	userarr.findOneAndDelete({_id:userid})
	        .then(ideas=>{
	            //取出的数据为ideas
	            //console.log(ideas);
	            res.json({
	            	code:'0',
	            	data:ideas
	            })
	        }).catch(error=>{
	        	console.log('错了')
	        })
})
// 验证Token是否过期(Home页)passport.authenticate('jwt',{session:false}),
routers.get('/rulesToken',passport.authenticate('jwt',{session:false}),(req,res)=>{
	if(req.user){
		res.json({
			code: '0',
			msg: req.user
		})
	}else{
		res.json({
			code:'1',
			msg:{}
		})
	}

	
	//请求头设置：Authorization:Token
})


// 新增分类名称
routers.post('/addcls',(req,res)=>{
	 //console.log(req.body);
	let str=req.body
new clslist(str)
    .save()
    .then(ides=>{
    	//console.log(ides)
        //存储成功
        res.json({
			code:'0',
			date:ides
		})
    }).catch(error=>{
    	 res.json({
			code:'1'
		})
    })
})
// 查询全部分类
routers.post('/searchcls',(req,res)=>{
	 //console.log(req.body);
	// let str=req.body
    clslist.find({})
        .sort()  //根据data字段倒叙
        .then(ideas=>{
            //取出的数据为ideas
            res.json({
            	code:'0',
            	data:ideas
            })
        })
})
// 查询分类总条数
routers.post('/clsNumber',(req,res)=>{
    clslist.find({})
		.countDocuments() 
        .then(ideas=>{
            //取出的数据为ideas
            //console.log(ideas);
            res.json({
            	code:'0',
            	data:ideas
            })
        })
})
// 查询分类列表(分页)
routers.post('/searchClsLists',(req,res)=>{
	 

	 let num=req.body.num  //第几页
	 let NumStr=req.body.NumStr  //每页的条数
	 let NumBers=(num-1)*NumStr  //
	clslist.find({})
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
})
// 修改分类
routers.post('/updateCls',(req,res)=>{
	 
	// let str=req.body
	let str=req.body.forms
	//console.log(str);
	clslist.findOne({
            _id:str._id
        })
        .then(ideas=>{
			ideas.name=str.name;
			ideas.desc=str.desc;

            ideas.save()
                .then(idea=>{
                    res.json({
                    	code:'0'

                    })
                }).catch(error=>{
                	//console.log(error);
                })
        }).catch(error=>{
        	//console.log('修改文章出错了');

        	res.json({
				code:'1'
			})
        })
})
// 删除分类
routers.post('/deleteClsli',(req,res)=>{
	 
	 let str=req.body.id

    clslist.findOneAndDelete({
            _id:str

        }).then(()=>{
            res.json({
            	code:'0'
            })
        }).catch(error=>{
        	res.json({
            	code:'1'
            })
        })
})


// 新增标签名称
routers.post('/addtables',(req,res)=>{
	 //console.log(req.body);
	let str=req.body
new tables(str)
    .save()
    .then(ides=>{
    	//console.log(ides)
        //存储成功
        res.json({
			code:'0',
			date:ides
		})
    }).catch(error=>{
    	 res.json({
			code:'1'
		})
    })
})
// 查询全部标签
routers.post('/searchtable',(req,res)=>{
	 //console.log(req.body);
	// let str=req.body
    tables.find({})
        .sort()  //根据data字段倒叙
        .then(ideas=>{
            //取出的数据为ideas
            res.json({
            	code:'0',
            	data:ideas
            })
        })
})
// 查询标签总条数
routers.post('/tableNumber',(req,res)=>{
    tables.find({})
		.countDocuments() 
        .then(ideas=>{
            //取出的数据为ideas
            //console.log(ideas);
            res.json({
            	code:'0',
            	data:ideas
            })
        })
})
// 查询标签列表(分页)
routers.post('/searchTablesLists',(req,res)=>{
	 

	 let num=req.body.num  //第几页
	 let NumStr=req.body.NumStr  //每页的条数
	 let NumBers=(num-1)*NumStr  //
	tables.find({})
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
})
// 修改标签
routers.post('/updateTable',(req,res)=>{
	 
	// let str=req.body
	let str=req.body.forms
	//console.log(str);
	tables.findOne({
            _id:str._id
        })
        .then(ideas=>{
			ideas.name=str.name;
			ideas.desc=str.desc;

            ideas.save()
                .then(idea=>{
                    res.json({
                    	code:'0'

                    })
                }).catch(error=>{
                	//console.log(error);
                })
        }).catch(error=>{
        	//console.log('修改文章出错了');

        	res.json({
				code:'1'
			})
        })
})
// 删除标签
routers.post('/deleteTableli',(req,res)=>{
	 
	 let str=req.body.id

    tables.findOneAndDelete({
            _id:str

        }).then(()=>{
            res.json({
            	code:'0'
            })
        }).catch(error=>{
        	res.json({
            	code:'1'
            })
        })
})
// 新增文章
routers.post('/addwrite',(req,res)=>{
	 
	// let str=req.body
	let strArr=req.body.forms
		strArr.types=req.body.types
		// console.log(strArr);
new texts(strArr)
    .save()
    .then(ides=>{
    	//console.log(ides)
        //存储成功
        res.json({
			code:'0'
		})
    }).catch(error=>{
    	 res.json({
			code:'1'
		})
    })
})
// 修改文章
routers.post('/updatewrite',(req,res)=>{
	 
	// let str=req.body
	let str=req.body.forms
	texts.findOne({
            _id:str._id
        })
        .then(ideas=>{
            ideas.types=req.body.types
			ideas.introduction=str.introduction;
			ideas.classed=str.classed;
			ideas.checkedA=str.checkedA;
			ideas.tx=str.tx;
			ideas.name=str.name;

            ideas.save()
                .then(idea=>{
                    res.json({
                    	code:'0'

                    })
                })
        }).catch(error=>{
        	//console.log('修改文章出错了');
        	res.json({
				code:'1'
			})
        })
})

// 查询文章列表
routers.post('/searchtxts',(req,res)=>{
	 
	 let str=req.body.types
	 let num=req.body.num
	 let NumStr=req.body.NumStr
	 let NumBers=(num-1)*NumStr
	texts.find({types:str},{introduction:0,tx:0,types:0})
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
})
// 查询某分类下的文章列表
routers.post('/searchClsAtxts',(req,res)=>{
	 
	 let userid=req.body.userid
	 let num=req.body.num
	 let NumStr=req.body.NumStr
	 let NumBers=(num-1)*NumStr
	texts.find({classed:userid},{introduction:0,tx:0})
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
})
// 查询某包含某标签的文章列表
routers.post('/searchTabsAtxts',(req,res)=>{
	 
	 let userid=req.body.userid
	 let num=req.body.num
	 let NumStr=req.body.NumStr
	 let NumBers=(num-1)*NumStr
	texts.find({"checkedA":{$all:[userid]}},{introduction:0,tx:0})
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
})
// 查询文章总条数
routers.post('/searchtxtsNum',(req,res)=>{
	 
	 let str=req.body.types

	texts.find({types:str})
		.countDocuments()
        .then(ideas=>{
            //取出的数据为ideas
            //console.log(ideas);
            res.json({
            	code:'0',
            	data:ideas
            })
        })
})
// 查询某一分类下的文章总条数
routers.post('/searchClstxtsNum',(req,res)=>{
	 
	 let userid=req.body.userid

	texts.find({classed:userid})
		.countDocuments()
        .then(ideas=>{
            //取出的数据为ideas
            //console.log(ideas);
            res.json({
            	code:'0',
            	data:ideas
            })
        })
})
// 查询某一分类下的文章总条数
routers.post('/searchTpyesNum',(req,res)=>{
	 
	 let str=req.body.id

	texts.find({classed:str})
		.countDocuments()
        .then(ideas=>{
            res.json({
            	code:'0',
            	data:ideas
            })
        })
})
// 查询包含某标签的文章总条数
routers.post('/searchTableAtxts',(req,res)=>{
	 
	 let str=req.body.id
	 //console.log(str);
	texts.find({"checkedA":{$all:[str]}})
		.countDocuments() 
        .then(ideas=>{
            //取出的数据为ideas
            //console.log(ideas);
            res.json({
            	code:'0',
            	data:ideas
            })
        })
})
// 查询包含某标签的文章总条数(B方案)
routers.post('/searchTableAtxtsArr',(req,res)=>{
	 
	 let str=req.body.userid
	// console.log(str);
	texts.find({"checkedA":{$all:[str]}})
		.countDocuments() 
        .then(ideas=>{
            //取出的数据为ideas
            //console.log(ideas);
            res.json({
            	code:'0',
            	data:ideas
            })
        })
})
// 查询具体文章
routers.post('/searchtexsli',(req,res)=>{
	 
	 let str=req.body.id

	texts.find({_id:str},{types:0,data:0})
        .sort()  //根据data字段倒叙
        .then(ideas=>{
            //取出的数据为ideas
            //console.log(ideas);
            res.json({
            	code:'0',
            	data:ideas
            })
        }).catch(err=>{
        	//console.log(err);
        })
})

// 删除具体文章
routers.post('/deletetexsli',(req,res)=>{
	 
	 let str=req.body.id

    texts.findOneAndDelete({
            _id:str

        }).then(()=>{
            res.json({
            	code:'0'
            })
        }).catch(error=>{
        	res.json({
            	code:'1'
            })
        })
})


// 添加关于本站——大事记
routers.post('/addAbout',(req,res)=>{
	let str=req.body.str
	new abouts(str)
	    .save()
	    .then(ides=>{
	    	//console.log(ides)
	        //存储成功
	        res.json({
				code:'0',
				data:ides
			})
	    }).catch(error=>{
	    	 res.json({
				code:'1'
			})
	    })
})
// 查询所有关于本站——大事记
routers.post('/allAbout',(req,res)=>{
	 let str=req.body.types

	abouts.find({types:str})
	        .then(ideas=>{
	            res.json({
	            	code:'0',
	            	data:ideas
	            })
	        })
})
// 删除一条关于本站——大事记
routers.post('/removeAbout',(req,res)=>{
	 let str=req.body.id

	abouts.findOneAndDelete({_id:str})
	        .then(ideas=>{
	            res.json({
	            	code:'0',
	            	data:ideas
	            })
	        }).catch(()=>{

	        })
})
// 修改一条关于本站——大事记
routers.post('/undateAbout',(req,res)=>{
	 let str=req.body.str

	abouts.findOne({
            _id:str._id
        })
        .then(ideas=>{
            ideas.desc=str.desc
			ideas.name=str.name;

            ideas.save()
                .then(idea=>{
                    res.json({
                    	code:'0'
                    })
                })
        }).catch(error=>{
        	//console.log('修改文章出错了');
        	res.json({
				code:'1'
			})
        })
})


//新增项目
routers.post('/addCase',(req,res)=>{
	let str=req.body
	//console.log(str)
	new allcase(str)
	    .save()
	    .then(ides=>{
	    	//console.log(ides)
	        //存储成功
	        res.json({
				code:'0'
			})
	    }).catch(error=>{
	    	//console.log(error)
	    	 res.json({
				code:'1'
			})
	    })
})
// 查询项目列表
routers.post('/searchCase',(req,res)=>{
	 
	 
	 let num=req.body.num
	 let NumStr=req.body.NumStr
	 let NumBers=(num-1)*NumStr
	allcase.find({})
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
})

// 查询项目总数
routers.post('/searchCaseAllNumber',(req,res)=>{
	allcase.find({})
		.countDocuments() 
        .then(ideas=>{
            //取出的数据为ideas
            //console.log(ideas);
            res.json({
            	code:'0',
            	data:ideas
            })
        }).catch(()=>{

        })
})
// 删除某一项目
routers.post('/removeCase',(req,res)=>{ 
	let id=req.body.ids
	//console.log(id)
	allcase.findOneAndDelete({_id:id})
        .then(ideas=>{
            //取出的数据为ideas
            //console.log(ideas);
            res.json({
            	code:'0',
            	data:ideas
            })
        }).catch(()=>{

        })
})

// 查询项目总数
routers.post('/searchCaseOnes',(req,res)=>{
	let userid=req.body.userid
	//console.log(userid)
	allcase.findOne({_id:userid}) 
        .then(ideas=>{
            //取出的数据为ideas
            //console.log(ideas);
            res.json({
            	code:'0',
            	data:ideas
            })
        }).catch(()=>{

        })
})

// 修改项目
routers.post('/updateCase',(req,res)=>{
	 let id=req.body._id
	// console.log(req.body._id)
	allcase.findOne({
            _id:id
        })
        .then(ideas=>{
            ideas.name=req.body.name
			ideas.desc=req.body.desc;
			ideas.addressA=req.body.addressA
			ideas.addressB=req.body.addressB;
			ideas.icons=req.body.icons
			ideas.indexs=req.body.indexs;
            ideas.save()
                .then(idea=>{
                    res.json({
                    	code:'0'
                    })
                })
        }).catch(error=>{
        	//console.log('修改文章出错了');
        	res.json({
				code:'1'
			})
        })
})

//commonts评论查询
routers.post('/searchCommonts',(req,res)=>{
	let num=req.body.num || 1
	 let NumStr=req.body.Number
	 let NumBers=(num-1)*NumStr

	commonts.find({},{emails:0})
			.sort({_id:-1})//根据data字段倒叙
		    .limit(NumStr)
		    .skip(NumBers) 
			.then(ideas=>{
				res.json({
					code:'0',
					data:ideas
				})
			}).catch(()=>{

        })
})

// 查询评论总数
routers.post('/searchCommontsAllNumber',(req,res)=>{
	commonts.find({})
		.countDocuments() 
        .then(ideas=>{
            //取出的数据为ideas
            //console.log(ideas);
            res.json({
            	code:'0',
            	data:ideas
            })
        }).catch(()=>{

        })
})
//commonts删除评论
routers.post('/removesCommonts',(req,res)=>{
	
	let userid=req.body.userid
	commonts.findOneAndDelete({_id:userid})
			.then(ideas=>{
				res.json({
					code:'0'
				})
			}).catch(()=>{

        })
})
//commonts同意展示
routers.post('/updataCommonts',(req,res)=>{
	
	let userid=req.body.userid
	commonts.findOneAndUpdate({_id:userid})
			.then(ideas=>{
				
		            ideas.types='2'

		            ideas.save()
		                .then(idea=>{
		                    res.json({
		                    	code:'0'
		                    })
		                })

			}).catch(()=>{

        })
})
module.exports = routers;
