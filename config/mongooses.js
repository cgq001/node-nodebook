//连接MongODB数据库
const mongoose=require('mongoose')
		mongoose.connect("mongodb://127.0.0.1/books",{useNewUrlParser:true},function(err){
			if (err) {
				console.log('连接失败')
			}else{
				console.log('连接成功')
			}
		})
module.exports=mongoose