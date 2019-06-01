const mongoose=require('mongoose')

// 用户列表 建模
const Schema=mongoose.Schema;

const IdeaSchema=new Schema({
	users:{   //昵称
        type:String,
        required:true
    },
    name:{   //用户名
        type:String,
        required:true
    },
    passwords:{  //密码
        type:String,
        required:true
    },
    desc:{  //权限  1,管理员，2测试账号
        type:String,
        required:true
    },
    emails:{  //邮箱
        type:String,
        default:'',
        required:false
    }

})
//创建模型
module.exports=mongoose.model('userarr',IdeaSchema) //'ideas' 集合名字 
