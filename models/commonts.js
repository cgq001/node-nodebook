const mongoose=require('mongoose')

// 用户列表 建模
const Schema=mongoose.Schema;

const IdeaSchema=new Schema({
	tetxids:{   //文章ID
        type:String,
        required:true
    },
    names:{   //评论者昵称
        type:String,
        required:true
    },
    emails:{  //评论者邮箱
        type:String,
        required:true
    },
    texts:{  //评论内容
        type:String,
        required:true
    },
    types:{  //评论是否经过审核
        type:String,
        default:1,
        required:false
    }

})
//创建模型
module.exports=mongoose.model('commonts',IdeaSchema) //'ideas' 集合名字 
