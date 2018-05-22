//引入mongoose的建模工具模块
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10 ;
var ObjectId = Schema.Types.ObjectId;

var key = 'Password!';

var UserSchema = Schema({
	name:{
		//设定用户是唯一的
		unique:true,
		type:String
	},
	password:String,
	email:String,
	phone:String,
	//头像
	img:String,
	//设置用户的管理权限，默认为0
	role:{
		type:Number,
		default:0
	},
	//简介
	content:{
		type:String,
		default:''
	},
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
UserSchema.pre('save',function(next){
	var user = this;
	//判断数据是否是新增数据，如果是，则将创建和修改的时间都设置为当前时间
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
	//如果是修改数据，则将修改的时间创建为当前时间
		this.meta.updateAt = Date.now();
	}
	var cryptos = aesEncrypt(user.password,key);
	user.password = cryptos;
	next();
	// bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
	// 	if(err) return next(err)

	// 		bcrypt.hash(user.password,salt,function(err,hash){
	// 			if(err) return next(err);

	// 			user.password = hash;

	// 			next();
	// 		});
	// });


});
//加密
function aesEncrypt(data,key){
	const cipher = crypto.createCipher('aes192',key);
	var crypted = cipher.update(data,'utf-8','hex');
	crypted += cipher.final('hex');
	return crypted;
}
//解密
function aesDecrypt(encrypted,key){
	const decipher = crypto.createDecipher('aes192',key);
	var decrypted = decipher.update(encrypted,'hex','utf-8');
	decrypted += decipher.final('utf-8');
	return decrypted;
}
//添加实例方法
UserSchema.methods = {
	//匹配密码
	comparePassword:function(_password){
		//利用bcrypt的compare方法进行比对
		// console.log(this);
		// bcrypt.compare(_password,this.password,function(err,isMatch){
		// 	// console.log(password);
		// 	if(err){
		// 		return cd(err);
		// 	}
		// 	cd(null,isMatch);
		// });
		var pass = aesEncrypt(_password,key);
		console.log(pass);
		console.log(this.password);
		var isMatch;
		if(pass == this.password){
			isMatch = true;
		}else{
			isMatch = false;
		}
		return isMatch;

	}
}
//MusicSchema模式的静态方法，不会直接与数据库交互，经过模型编译和实例化后才会具有此方法
UserSchema.statics = {
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
module.exports = UserSchema;