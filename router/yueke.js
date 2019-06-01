const express  = require('express');

const yuekes= express.Router();

const mongoose=require('../config/mongooses.js')

//引入分类模型
require('../models/clslist')
const clslist=mongoose.model('clslist')
//引入标签模型
require('../models/tables')
const tables=mongoose.model('tables')
//引入文章模型
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
//引入本站评论模型
require('../models/commonts')
const commonts=mongoose.model('commonts')
//引入邮箱中间件
const nodemailer=require('nodemailer')
//邮箱验证码中间件配置
 let transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    service: 'QQ', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    port: 465, // SMTP 端口
    secureConnection: true, // 使用了 SSL
    auth: {
      user: 'cuiguoqiang88@qq.com', //发送者邮箱
      // 这里密码不是qq密码，是你设置的smtp授权码
      pass: 'xqnwjqcoyudebcji',    
    }
  });


//测试
yuekes.get('/',(req,res)=>{
	res.json({
		code:0
	})
})
// 查询文章列表,首页
yuekes.post('/searchtxts',(req,res)=>{
	let str='1' //tagId 标签ID
	 let num=req.body.num || 1
	 let NumStr=req.body.NumStr
	 let NumBers=(num-1)*NumStr
	if(!req.body.tagId){
		texts.find({types:str},{tx:0,types:0})
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
		        }).catch(()=>{
		        	res.json({
		            	code:'1'
		            })
		        })
	}else{
		texts.find({types:str,"checkedA":{$all:[req.body.tagId]}},{tx:0,types:0})
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
		        }).catch(()=>{
		        	res.json({
		            	code:'1'
		            })
		        })
	}
	
})
// 查询文章列表,搜索
yuekes.post('/searchtxtsAlls',(req,res)=>{
	let str='1' //tagId 标签ID
	 let num=req.body.num || 1
	 let NumStr=req.body.NumStr
	 let NumBers=(num-1)*NumStr
	 let strArr=req.body.txts
		texts.find({types:str,"tx":{$regex: strArr, $options:'i'}},{tx:0,types:0})
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
		        }).catch(()=>{
		        	res.json({
		            	code:'1'
		            })
		        })
	
	
})
// 查询文章列表，分类页
yuekes.post('/searchClassTxts',(req,res)=>{
	let str='1' //tagId 标签ID
	 let num=req.body.num || 1
	 let NumStr=req.body.NumStr
	 let NumBers=(num-1)*NumStr
	if(!req.body.tagId){
		texts.find({types:str},{tx:0,types:0})
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
		        }).catch(()=>{
		        	res.json({
		            	code:'1'
		            })
		        })
	}else{
		texts.find({types:str,"classed":req.body.tagId},{tx:0,types:0})
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
		        }).catch(()=>{
		        	res.json({
		            	code:'1'
		            })
		        })
	}
	
})
// 查询热们文章列表
yuekes.post('/searchRedtxts',(req,res)=>{
	let str='1' //tagId 标签ID
	 let NumStr=req.body.NumStr
	
		texts.find({types:str},{name:1,_id:1})
		        .sort({reads:-1})//根据data字段倒叙
		        .limit(NumStr) 
		        .then(ideas=>{
		            //取出的数据为ideas
		           // console.log(ideas);
		            res.json({
		            	code:'0',
		            	data:ideas
		            })
		        }).catch(()=>{
		        	res.json({
		            	code:'1'
		            })
		        })

	
})

// 查询全部标签
yuekes.post('/searchtable',(req,res)=>{
	 //console.log(req.body);
	// let str=req.body
    tables.find({})
        .sort({data:"desc"})  //根据data字段倒叙
        .then(ideas=>{
            //取出的数据为ideas
            res.json({
            	code:'0',
            	data:ideas
            })
        }).catch(()=>{
		        	res.json({
		            	code:'1'
		            })
		        })
})
// 查询全部分类
yuekes.post('/searchClass',(req,res)=>{
	 //console.log(req.body);
	// let str=req.body
    clslist.find({})
        .sort({data:"desc"})  //根据data字段倒叙
        .then(ideas=>{
            //取出的数据为ideas
            res.json({
            	code:'0',
            	data:ideas
            })
        }).catch(()=>{
		        	res.json({
		            	code:'1'
		            })
		        })
})
// 查询具体文章
yuekes.post('/searchtexsli',(req,res)=>{
	 
	 let str=req.body.id
	   texts.findOne({
            _id:str
        })
        .then(ideaA=>{
            ideaA.reads=ideaA.reads+1

            ideaA.save()
                .then(ideaB=>{
                	texts.findOne({_id:str},{types:0})
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
                }).catch(()=>{
		        	res.json({
		            	code:'1'
		            })
		        })
            }).catch(()=>{
		        	res.json({
		            	code:'1'
		            })
		        })
	
})
// 发送验证码
yuekes.post('/emailCont',(req,res)=>{
	 
	 let emails=req.body.emails
	 let numbers=req.body.numbers

	 	let HT=`<h3>你的验证码为：${req.body.numbers},欢迎评论我的文章</h3><p>本邮件为系统发送，如有打扰，请屏蔽！</p>`
        let mailOptions = {
            from: 'cuiguoqiang88@qq.com', // 发送者
            to: req.body.emails, // 接收者
            subject: '学习笔记小站', // 邮件的标题
            html: HT // html body   //邮件的内容
        };
       transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);   //这里表示：有错误则返回错误
            }

            res.json({
            	code:'0',
            	numbers:numbers
            })
          });	
})

// 添加评论
yuekes.post('/mgs',(req,res)=>{
	
	 let userid=req.body.userid
	 let str=req.body.str
	 let strArr={
	 		tetxids:userid,
	 		names:str.names,
	 		emails:str.emails,
	 		texts:str.texts
	 }
	 texts.update({"_id": userid}, {$inc: {comments: 1}})
	  texts.findOne({
            _id:userid
        })
        .then(ideas=>{
            ideas.comments=ideas.comments+1

            ideas.save()
                .then(idea=>{
                    
                	new commonts(strArr)
				    		.save()
				    		.then(ideasArr=>{
				    			 res.json({
								 	code:0
								 })
				    		})
				    		.catch(()=>{
				    			res.json({
								 	code:1
								 })
				    		})

                })
        }).catch(()=>{
		        	res.json({
		            	code:'1'
		            })
		        })  
})
// 查询评论
yuekes.post('/searchMsg',(req,res)=>{
	
	 let userid=req.body.userid
	 let nus='1'
	// console.log('123');
	 commonts.find({'tetxids':userid,types:'2'},{emails:0})
	 			.sort() 
	 			.then(ideas=>{
	 				res.json({
	 					code:0,
	 					data:ideas
	 				})
	 			}).catch(()=>{
	 				res.json({
	 					code:1
	 				})
	 			})

})

//查询全部案例
yuekes.post('/cases',(req,res)=>{
	//console.log('123')
	
	allcase.find({})
			.sort({_id:-1})
			.then(ideas=>{
				res.json({
	 					code:0,
	 					data:ideas
	 				})	
			}).catch(()=>{
				res.json({
	 					code:1
	 				})
			})
})

// 查询前端关于我们
yuekes.post('/searchAbout',(req,res)=>{
	 //console.log(req.body);
	// let str=req.body
    abouts.find({types:'1'})
        .sort({_id:-1})  //根据data字段倒叙
        .then(ideas=>{
            //取出的数据为ideas
            res.json({
            	code:'0',
            	data:ideas
            })
        }).catch(()=>{
		        	res.json({
		            	code:'1'
		            })
		        })
})
module.exports=yuekes