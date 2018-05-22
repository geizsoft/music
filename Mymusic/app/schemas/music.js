//引入mongoose的建模工具模块
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MusicSchema = Schema({
	title:String,
	singer:String,
	special:String,
	time:Number,
	country:String,
	language:String,
	summary:String,
	poster:String,
	song:String,
	//存储上传音乐的用户
	user:{
		type:ObjectId,
		//指向的数据库模型
		ref:'User'
	},
	category:{
		type:ObjectId,
		ref:'Category'
	},
	//点击量
	click:{
		type:Number,
		default:0
	},
	lrc:String,
	//存放录入或者更新数据时的时间记录
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
MusicSchema.pre('save',function(next){
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
MusicSchema.statics = {
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
module.exports = MusicSchema;