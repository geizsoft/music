//引入mongoose建模工具模块
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//数据结构
var HistorySchema = Schema({
	user:{
		// unique:true,
		type:ObjectId,
		ref:'User'
	},
	//存储播放过的、收藏的音乐
	music:{
		type:ObjectId,
		ref:'Music'
	},
	category:String,
	singer:String,
	//听过
	listen:{
		type:Number,
		default:0
	},
	//收藏
	collect:{
		type:Number,
		default:0
	},
	//循环
	continue:{
		type:Number,
		default:0
	},
	comment:{
		type:Number,
		default:0
	},
	//播放次数
	count:{
		type:Number,
		default:0
	},
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
//在每次存储数据前都会调用该方法
HistorySchema.pre('save',function(next){
	//判断数据是否是新增数据，如果是，则将创建和修改的时间都设置为当前时间
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
	//如果是修改数据，则将修改的时间创建为当前时间
		this.meta.updateAt = Date.now();
	}

	//继续往下执行
	next();
});

//MusicSchema模式的静态方法，不会直接与数据库交互，经过模型编译和实例化后才会具有此方法
HistorySchema.statics = {
	//取出数据库中的所有数据
	fetch:function(cb){
		//按照更新的时间排序，执行查询后将结果传入回调方法中
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	//查询单条数据
	findById:function(id,cb){
		//通过唯一id查询单条数据，将结果传入回调方法
		return this
			.findOne({_id:id})
			.sort('meta.updateAt')
			.exec(cb);
	}
};
//将模式导出
module.exports = HistorySchema;