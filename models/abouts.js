const mongoose=require('mongoose')

// 关于本站 建模
const Schema=mongoose.Schema;

const IdeaSchema=new Schema({
    name:{   //分类名称
        type:String,
        required:true
    },
    desc:{  //分类描述
        type:String,
        required:true
    },
    types:{   // 1为前端  2为后端
    	type:String,
        required:true
    }
})
//创建模型
module.exports=mongoose.model('abouts',IdeaSchema) //'ideas' 集合名字 