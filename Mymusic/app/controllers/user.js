var User = require('../models/user');
var Music = require('../models/music');
var History = require('../models/history');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
const SALT_WORK_FACTOR = 10 ;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
//用户注册页面
exports.sign = function(req,res){
	res.render('users/userSign',{
			title:'users 注册',
			sign:["true"]
		});
	
}

//注册逻辑
exports.signin = function(req,res){
	var _user = req.body.user;
	console.log(_user);
	// console.log(_user);
	//查找传递过来的用户名是否是注册过的
	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err);
		}
		//如果查找到user,重定向到登录页面
		if(user){
			return res.redirect('/login');
		}else{
			//没有查询到，则在数据库中创建新用户，重定向到首页 
			var user = new User(_user);
			//首先注册后头像为默认头像
			user.img = "/img/1.jpeg";
			user.save(function(err,user){
				if(err){
					console.log(err);
				}
				res.redirect('/');
			});
		}
	});
}



//用户登录逻辑
exports.login = function(req,res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	// console.log(typeof(name));
	//登录时将用户名和密码和session中的登录的用户对比，如果有则证明用户在其他地方登录,除去该用户登录的session
	//因为session中存储的是字符串，所以使用正则表达式进行字符串匹配
	MongoClient.connect(url,function(err,db){
		var dbo = db.db("music");
		dbo.collection('sessions').find({session:{$regex:name}}).toArray(function(err,result){
			// console.log(result);
			// console.log(result[0].session);
			if(result.length == 0){
				//用户没有登录
				logs(name,password,req,res);
			}else{
				//用户在其他地方登录了，删除数据库中的该用户的session数据
				var id = result[0]._id;
				dbo.collection('sessions').remove({_id:id});
				logs(name,password,req,res);
			}
			db.close();
		});
	});
}

function logs(name,password,req,res){
	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err);
		}
		//如果没有查找到用户，重定向到注册页面
		if(!user){
			return res.redirect('/user/sign');
		}
		// console.log("#############");
		// console.log(user.password == '$2a$10$gwXJIg23pxF63rfj.rYf4eh.0Azag9FC35dNHKcVKp1uEBTu6AkZO');
		// bcrypt.compare(password,user.password,function(err,isMatch){
		// 	console.log(isMatch);
		// })
		// console.log(bcrypt.compareSync(password, user.password));
		// bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		// 	bcrypt.hash(password,salt,function(err,hash){
		// 		console.log(hash);
		// 		console.log(hash == '$2a$10$gwXJIg23pxF63rfj.rYf4eh.0Azag9FC35dNHKcVKp1uEBTu6AkZO');
		// 	})
		// })
		
		// user.comparePassword(password,function(err,isMatch){
		// 	if(err){
		// 		console.log(err);
		// 	}
		// 	// console.log(password);
		// 	console.log(isMatch);
		// 	if(isMatch){
		// 		req.session.user = user;
		// 		return res.redirect('/');

		// 	}else{
		// 		// console.log("false");
		// 		return res.redirect('/user/loginPage');
		// 	}
		// });
		var isMatch = user.comparePassword(password);
		if(isMatch){
			req.session.user = user;
			return res.redirect('/');
		}else{
			// console.log("false");
			return res.redirect('/user/loginPage');
		}
	});
}

//登录页面
exports.loginPage = function(req,res){
	res.render('users/userLogin',{
			title:'users 登录',
			login:["true"]
		});
}

//用户登出
exports.logout = function(req,res){
	delete req.session.user;
	delete req.session.music;
	console.log(req.session.music);
	// req.session.destroy();
	res.redirect('/')
}

//获取用户名
exports.getName = function(req,res){
	var name = req.query.name;
	// console.log(name);
	if(name){
		User.findOne({name:name},function(err,user){
			if(err){
				console.log(err);
			}
			if(!user){
				res.json({name:2});
			}else{
				res.json({name:1});
			}
		});
	}
}


//判断是否是登录状态
exports.loginRequired = function(req,res,next){
	var user = req.session.user;
	if(!user){
		return res.redirect('/user/loginPage');
	}
	next();
}

//个人主页页面
exports.userPage = function(req,res){
	var user = req.session.user;
	Music.find({user:user._id})
		.limit(30)
		.exec(function(err,musics){
			//查找用户收藏记录
			History.find({user:user._id,collect:2})
				.populate('music','id title singer')
				.limit(30)
				.exec(function(err,history){
					//查找用户听歌记录
					History.find({user:user._id,listen:1})
						.populate('music','id title singer')
						.limit(10)
						//降序排序
						.sort({'count':-1})
						.exec(function(err,listen){
							// console.log(user.content);
							res.render('users/userPage',{
								title:'个人主页',
								user:user,
								listen:listen,
								musics:musics,
								history:history
							});
						});
					
				});
			
		});
	
}
exports.updateName = function(req,res){
	console.log(req.body);
	var data = req.body;
	var currentuser = req.session.user;
	if(currentuser.name == data.name){
		// currentuser.name = data.name;
		currentuser.email = data.email;
		currentuser.phone = data.phone;
		currentuser.content = data.content;
		req.session.user.content = data.content;
		User.findById(currentuser,function(err,user){
			// console.log(user);
			_user = _.extend(user,currentuser);
			// console.log(currentuser);
			_user.save(function(err,user1){
				// console.log(user1);
				res.json({success:1});
			});
			
		});
		
	}else{
		User.find({name:data.name},function(err,user){
			// console.log(user);
			if(user.lenght == 0){
				User.findById(currentuser._id,function(err,user){
					currentuser.name = data.name;
					currentuser.email = data.email;
					currentuser.phone = data.phone;
					currentuser.content = data.content;
					req.session.user.content = data.content;
					_user = _.extend(user,currentuser);
					_user.save(function(err,user){
						res.json({success:1});
					});
				});
				
			}else{
				res.json({success:0});
			}
		});
	}
	

	// res.json({success:1});
	// var name = req.body.user.name;
	// var id = req.body.user._id;
	// if(name && name !== ""){
	// 	User.findById(id,function(err,_user){
	// 		User.findOne({name:name},function(err,user){
	// 			if(err){
	// 				console.log(err);
	// 			}
	// 			if(!user){
	// 				_user.name = name;
	// 				_user.save(function(err,user){
	// 					if(err){
	// 						console.log(err);
	// 					}
	// 					req.session.user.name = name;
	// 					res.redirect("/user/userPage");
	// 				});
	// 			}else{
	// 				res.redirect("/user/userPage");
	// 			}
	// 		});
	// 	});
	// }
}
//修改密码页面
exports.pwdPage = function(req,res){
	var user = req.session.user;
	res.render('users/pwdPage',{
			title:'修改密码',
			user:user
		});
}
exports.updatePwd = function(req,res){
	var pwd = req.body.user.pwd;
	var id = req.body.user._id;
	// console.log(id);
	if(pwd && pwd !== ''){
		User.findById(id,function(err,user){
			// console.log(user.password);
			user.password = pwd;
			user.save(function(err,user){
				// console.log(user.password);
				if(err){
					console.log(err);
				}
				delete req.session.user;
				res.redirect("/user/loginPage");
			});
		});
	}

}
//修改邮箱页面
exports.emailPage = function(req,res){
	var user = req.session.user;
	res.render('users/emailPage',{
		title:'修改邮箱',
		user:user
	});
}
//修改用户名页面
exports.namePage = function(req,res){
	var user = req.session.user;
	res.render('users/namePage',{
		title:'修改用户名',
		user:user
	});
}
//修改电话页面
exports.phonePage = function(req,res){
	var user = req.session.user;

	res.render('users/phonePage',{
		title:'修改电话',
		user:user
	});
}
//修改头像
exports.img = function(req,res){
	var user = req.session.user;
	console.log(user);
	res.render('users/imgPage',{
		title:'头像修改',
		user:user
	});
}
exports.changeImg = function(req,res,next){
	if(req.files.input.size !== 0 && req.files.input.type == 'image/jpeg'){
		console.log(req.files.input);
		var userId = req.session.user._id;
		User.findById(userId,function(err,user){
			console.log(user.img+"################");
			var str = user.img;
			if(str == "/img/001.jpg"){
				console.log("asda");
			}else{
			// 	//获取绝对路径
				var url = user.img;
				url = path.join(__dirname,'../../','public',url);
				console.log(url);
				fs.unlink(url,function (err) {
					if(err){
						console.log(err);
					}else{
						console.log("删除成功");

					}
				});
			}
		});
		var image = req.files.input;
		var filePath = image.path;
		var originalName = image.originalFilename;
		// if()
		if(originalName){
			fs.readFile(filePath,function(err,data){
				var timestamp = Date.now();
				var type = image.type.split('/')[1];
				var img =req.session.user.name + timestamp + "." + type;
				var newPath = path.join(__dirname,'../../','public/upload/userimg/' + img);
				fs.writeFile(newPath, data, function(err){
					req.session.user.img = "/upload/userimg/"+ img;
					next();
				});
			});
		}
	}else{
		next();
	}
}

exports.updateUser = function(req,res){
	var seUser = req.session.user;
		User.findById(seUser._id,function(err,user){
			_user = _.extend(user,seUser);

			_user.save(function(err,user){
				if(err){
					console.log(err);
				}
				res.redirect("/user/userPage");
			});
		});
}
//忘记密码页面
exports.forgetPage = function(req,res){
	res.render('users/forget',{
		title:'忘记密码'
	});
}
exports.forgetName = function(req,res){
	// console.log(req.body);
	var name = req.body.name;
	// console.log(name);
	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err);
		}
		// console.log(user);
		if(user){
			res.json({success:1});
		}else{
			res.json({success:0});
		}
	});
}
exports.forgetEmail = function(req,res,next){
	var name = req.body.name;
	var email = req.body.email;
	User.findOne({name:name},function(err,user){
		if(err){

		}
		if(user.email == email){
			next();
		}else{
			res.json({success:1});
		}

	});
}
exports.forgetPwd = function(req,res){
	// var pwd = req.body.pwd;
	// console.log(req.body);
	var name = req.body.name;
	var pwd = req.body.pwd;

	User.findOne({name:name},function(err,user){
		user.password = pwd;
		user.save(function(err,user){
			if(err){
				console.log(err);
			}
			res.json({data:1});
		});
	});
}


//修改逻辑
exports.updatePhone = function(req,res){
	// console.log(req.body);
	var phone = req.body.user.phone;
	var email = req.body.user.email;
	// console.log(phone);
	var id = req.body.user._id;
	// console.log(req.session.user);
	if(phone && phone !== ''){
		User.findById(id,function(err,user){
			if(err){
				console.log(err);
			}
			var newUser = user;
			newUser.phone = phone;

			_user = _.extend(user,newUser);
			// console.log(_user);
			_user.save(function(err,user){
				if(err){
					console.log(err);
				}
				// console.log(user);
				req.session.user = user;
				res.redirect("/user/userPage");
			});
		});
	}else if(phone == ''){
		// console.log("343");
		res.redirect("/user/update/phone");
	}


	//邮箱修改
	if(email && email !== ''){
		User.findById(id,function(err,user){
			if(err){
				console.log(err);
			}
			var newUser = user;
			newUser.email = email;
			_user = _.extend(user,newUser);
			_user.save(function(err,user){
				if(err){
					console.log(err);
				}
				req.session.user = user;
				res.redirect("/user/userPage");
			});
		});
	}else{
		res.redirect("/user/update/email");
	}
	
}

//在管理系统中的后台操作******************************************
exports.adminloginRequired = function(req,res,next){
	var user = req.session.user;
	if(!user){
		return res.redirect('/admin/userlogin');
	}
	next();
}
exports.adminlogin = function(req,res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err);
		}
		//如果没有查找到用户，重定向到注册页面
		if(!user){
			return res.redirect('/admin/userlogin');
		}

		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err);
			}

			if(isMatch){
				// console.log("true");
				req.session.user = user;
				return res.redirect('/admin/adminIndex');

			}else{
				// console.log("false");
				return res.redirect('/admin/userlogin');
			}
		});


	});
}

//判断是否是管理员
exports.isAdmin = function(req,res,next){
	var user = req.session.user;
	if(user.role <= 10){
		return res.redirect('/admin/userlogin');
	}
	next();
}

//在普通用户网页进入管理员界面
exports.adminIndex = function(req,res){
	var user = req.session.user;

		res.render('admin/adminIndex',{
			title:'管理员界面',
			user:user,
			
		});
	
}

//删除用户
exports.delete = function(req,res){
	var id = req.query.id;
	if(id){
		User.remove({_id:id},function(err,user){
			if(err){
				console.log(err);
			}else{
				res.json({success:1});
			}

		});
	}
}

//查找所有的用户
exports.userlist = function(req,res){
	var count = 20;
	var page = parseInt(req.query.p,10) || 0;
	var index = page * count;
	var p = req.query.p;
	if(p == undefined){
		User.fetch(function(err,users){
			if(err){
				console.log(err);
			}
			var results = users.slice(index,index + count);
			res.render('admin/userList',{
				title:'用户列表',
				users:results,
				totalPage:Math.ceil(users.length / count),
				currentPage:(page + 1)
			});
		});
	}else{
		User.find({})
			.limit(count)
			.skip(index)
			.sort('meta.updateAt')
			.exec(function(err,users){
				res.json({users:users});
			});
	}
}

//用户登出
exports.adminlogout = function(req,res){
	delete req.session.user
	// delete app.locals.user
	
	res.redirect('/admin/adminIndex');
}

exports.adminloginPage = function(req,res){
	res.render('admin/adminLogin',{
			title:'users 登录',
			login:['true']
		});
}
//修改权限
exports.changeRole = function(req,res){
	console.log(req.body);
	var role = req.body.role;
	role = parseInt(role);
	var id = req.body.id;
	User.findById(id,function(err,user){
		user.role = role;
		// console.log(user);
		user.save(function(err,user){
			console.log(user);
		});
		res.json({success:1,role:role});
	});
}

//配置发送邮件的邮箱
var transporter = nodemailer.createTransport({//邮件传输
	host:"smtp.qq.com",//qq smtp服务器地址
	secureConnection:false,//是否使用安全连接，对https协议的
	port:465,//qq邮箱服务器所占用的端口
	auth:{
		user:'1799862777@qq.com',//开启SMTP的邮箱，用来发送邮件
		pass:'yndscsccwhrndffg'//SMTP服务授权码
	}

});

exports.sendemail = function(req,res){//调用指定邮箱给用户发送邮件
	var code="";
	for(var i = 0 ; i < 5; i++){
		code += Math.floor(Math.random()*10);
	}
	// console.log(req.body);
	var email = req.body.email;
	// console.log(code);
	var mailOption = {
		from:'1799862777@qq.com',
		to:email,//收件人
		subject:'音乐网站注册验证码',
		html:"<p>尊敬的用户您好：</p>"+"<p>&nbsp;&nbsp;&nbsp;&nbsp;感谢您使用本网站，您的验证码为"+
			code+"，请尽快完成验证( • ̀ω•́ )✧</p>"
	};
	// console.log(mailOption);
	// 3083499828@qq.com
	transporter.sendMail(mailOption,function(err,info){
		if(err){
			res.json({success:1});
			return console.info(err);
		}else{
			req.session.yanzhengma = code;
			res.json({success:2,code:code});
			console.info("Message send" +  code);
		}
	});
	// res.send({success:2,code:code});
}