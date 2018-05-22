  //引入mongoose的建模工具模块
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
//数据结构
var CategorySchema = new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	musics:[{
		type:ObjectId,
		ref:'Music'
	}],
	meta:{
		//创建的时间
		createAt:{
			type:Date,
			default:Date.now()
		},
		//更新的时间
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});

CategorySchema.pre('save',function(next){
	// 判断数据是否是新增加的
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

CategorySchema.statics = {
	fetch:function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.sort('meta.updateAt')
			.exec(cb);
	}
}

module.exports = CategorySchema;