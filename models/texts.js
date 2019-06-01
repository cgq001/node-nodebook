const mongoose=require('mongoose')

// 文章列表 建模
const Schema=mongoose.Schema;

const IdeaSchema=new Schema({
    name:{   //文章标题
        type:String,
        required:true
    },
    introduction:{  //文章简介
        type:String,
        required:true
    },
    classed:{  //文章分类
        type:String,
        required:true
    },
    checkedA:{  //文章标签
        type:Array,
        required:true
    }, 
    tx:{  //文章内容
        type:String,
        required:true
    },
    types:{  //类型 1 文章   2 草稿
        type:String,
        required:true
    },
    bst:{    //编辑器  1 富文本，2 MarkDown
        type:String,
        required:true
    },
    reads:{    //阅读
        type:Number,
        default:0,
        required:false
    },
    loves:{    //喜欢
        type:Number,
        default:0,
        required:false
    },
    comments:{    //评论
        type:Number,
        default:0,
        required:false
    },
    data:{  //创作时间
        type:Date,
        default:Date.now
    }
})
//创建模型
module.exports=mongoose.model('texts',IdeaSchema) //'ideas' 集合名字