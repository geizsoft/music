// //引入mongoose的建模工具模块
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var ObjectId = Schema.Types.ObjectId;
// //数据结构
// var SingerSchema = Schema({
// 	music:[{
// 		type:ObjectId,
// 		ref:'Music'
// 	}],
// 	name:String,
// 	information:String,
// 	honor:String,
// 	special:[{
// 		name:String
// 	}],
// 	meta:{
// 		//创建的时间
// 		createAt:{
// 			type:Date,
// 			default:Date.now()
// 		},
// 		//更新的时间
// 		updateAt:{
// 			type:Date,
// 			dafault:Date.now()
// 		}
// 	}

// });
// SingerSchema.pre('save',function(next){
// 	// 判断数据是否是新增加的
// 	if(this.isNew){
// 		this.meta.createAt = this.meta.updateAt = Date.now();
// 	}else{
// 		this.meta.updateAt = Date.now();
// 	}
// 	next();
// });

// SingerSchema.statics = {
// 	fetch:function(cb){
// 		return this
// 			.find({})
// 			.sort('meta.updateAt')
// 			.exec(cb);
// 	},
// 	findById:function(id,cb){
// 		return this
// 			.findOne({_id:id})
// 			.sort('meta.updateAt')
// 			.exec(cb);
// 	}
// }

// module.exports = SingerSchema;