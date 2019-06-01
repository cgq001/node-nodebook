const mongoose=require('mongoose')

// 用户列表 建模
const Schema=mongoose.Schema;

const IdeaSchema=new Schema({
	name:{   //项目名称
        type:String,
        required:true
    },
    desc:{   //项目描述
        type:String,
        required:true
    },
    addressA:{  //项目预览地址
        type:String,
        required:true
    },
    addressB:{  //项目GitHub地址
        type:String,
        required:true
    },
    icons:{  //项目图标
        type:String,
        required:true
    },
    indexs:{ //图标索引
    	type:Number,
        required:true
    }

})
//创建模型
module.exports=mongoose.model('allcase',IdeaSchema) //'ideas' 集合名字 
