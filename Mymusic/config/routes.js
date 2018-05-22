var Music = require('../app/controllers/music');
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');
var History = require('../app/controllers/history');




module.exports = function(app){
	//编写路由
	//预处理
	//避免别的客户端访问也能直接显示登录状态,使用res.locals,用户的登录信息只保存在当前请求内
	app.use((req,res,next)=>{
		var _user = req.session.user;
		
		if(_user){
			// console.log(_user);
			res.locals.user = _user;
		}
		next();
	});

	//主页路由
	// app.get('/',Index.index);
	app.get('/',Index.index);
	app.post('/send',Index.analyze);
	app.get('/analyze',Index.analyze);
	//判断页面是否关闭
	// app.get('/close',Index.close);
	app.get('/all',Index.allMusic);
	app.post('/all/page',Index.allMusic);

	//获取分类的音乐
	app.post('/musicCate',Index.getCateMusic);

	//adminIndex
	app.get('/admin/adminIndex',User.adminIndex);

	//用户页面路由
	//注册页面
	app.get('/user/sign',User.sign);
	app.post('/user/sign',User.getName);
	//发送邮箱验证码
	app.post('/sendemail',User.sendemail);
	//登录页面
	app.get('/user/loginPage',User.loginPage);
	//异步查询用户名
	app.post('/user/loginPage',User.getName);
	//注册逻辑
	app.post('/user/signin',User.signin);
	//用户个人页面
	app.get('/user/userPage',User.loginRequired,User.userPage);
	//登录
	app.post('/user/login',User.login);
	//登出
	app.get('/logout',User.logout);
	//修改密码
	app.get('/user/update/pws',User.loginRequired,User.pwdPage);
	app.post('/user/update/pws',User.loginRequired,User.updatePwd);
	//修改邮箱
	app.get('/user/update/email',User.loginRequired,User.emailPage);
	//修改用户名
	app.get('/user/update/name',User.loginRequired,User.namePage);
	app.post('/user/update/name',User.loginRequired,User.updateName);

	//修改电话
	app.get('/user/update/phone',User.loginRequired,User.phonePage);
	app.post('/user/update/phone',User.loginRequired,User.updatePhone);
	
	//修改头像
	app.get('/user/update/img',User.loginRequired,User.img);
	app.post('/user/update/img',User.loginRequired,User.changeImg,User.updateUser);

	//忘记密码
	app.get('/user/forgetpwd',User.forgetPage);
	app.post('/user/postName',User.forgetName);
	app.post('/user/postEmail',User.forgetEmail,User.sendemail);
	app.post('/user/postPwd',User.forgetPwd);
	//修改权限
	app.post('/user/changeRole',User.changeRole);


	//管理系统*********************************************
	//用户列表
	app.get('/admin/userlist',User.adminloginRequired,User.isAdmin,User.userlist);
	app.post('/admin/userlist',User.adminloginRequired,User.isAdmin,User.userlist);

	//删除用户
	app.delete("/admin/userlist",User.adminloginRequired,User.isAdmin,User.delete);
	//管理员登录页面
	app.get("/admin/userlogin",User.adminloginPage);
	// app.post('/admin/userlogin',User.adminlogin);
	app.get('/adminlogout',User.adminlogout);



	//音乐页面路由
	//歌曲详情页面
	app.get('/music/:id',Music.detail);
	app.post('/music/player',Music.palyer);
	//歌手详情页面
	app.get('/music/singer/:singer',Music.singer);
	app.post('/music/getMusic',Music.getMusic);
	//清空音乐
	app.post('/music/delete',Music.musicDelete);
	//获取用户上传的音乐
	app.post('/music/userUpload',User.loginRequired,Music.userUpload);

	

	//更新页面
	app.get('/music/update/:id',User.loginRequired,Music.update);
	//提交表单后的逻辑
	app.post('/music/new',User.loginRequired,Music.savePoster,Music.saveMusic,Music.save);
	//录入页面
	app.get('/upload/music',User.loginRequired,Music.new);

	//admin**********************************************************
	//列表页面
	app.get('/admin/list',User.loginRequired,User.isAdmin,Music.list);
	app.post('/admin/list',User.loginRequired,User.isAdmin,Music.list);

	
	//删除
	app.delete('/admin/list',User.loginRequired,User.isAdmin,Music.delete);
	



	//评论功能路由
	//提交评论
	app.post('/user/comment',User.loginRequired,Comment.save);
	//评论点赞数量存储
	app.post('/comment/like',User.loginRequired,Comment.savenumber);
	app.delete('/comment/delete',Comment.delete);

	
	
	//分类
	app.get('/admin/category',User.loginRequired,User.isAdmin,Category.page);
	app.post('/admin/category/new',User.loginRequired,User.isAdmin,Category.save);
	//查找所有的分类
	app.get('/admin/categoriesList',User.loginRequired,User.isAdmin,Category.list);
	app.post('/admin/categoriesList',User.loginRequired,User.isAdmin,Category.list);

	app.delete('/admin/categoriesList',User.loginRequired,User.isAdmin,Category.delete);

	//Results
	app.get('/results',Index.search);

	//history
	app.post('/user/history',History.save);
	app.post('/user/collect',History.collect);
	app.post('/history/collect',History.collection);

	app.get('/history/listen',History.listenHis);
	app.get('/history/collect',History.collectHis);
	app.get('/history/update',History.updateHis);
	

	//上传歌词
	app.get('/uploadlrc/:id',Music.uploadlrc);
	app.post('/uploadlrc',Music.uploadlrcs);
}