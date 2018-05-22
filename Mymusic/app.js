//加载express模块
var express = require('express');
//引入path，可以设置样式、脚本的路径
var path = require('path')
//设置端口号为3010
var port = process.env.PORT || 3010;
//引入mongoose模块，用来连接本地的数据库
var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/music';
var bodyParser = require('body-parser');
//引入bluebird
var bluebird = require('bluebird');
//将mongoose.promise替换成bluebird
mongoose.Promise=bluebird;
var fs = require('fs');

//引入sessin和cookie
var session = require('express-session');
var cookieParser = require('cookie-parser');
//利用mongodb做会话的持久化
var mongoStore = require('connect-mongo')(session);
var multipart = require('connect-multiparty');


//启动一个web服务器
var App = express();


mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);

//监听3010端口
App.listen(port);


//models loading
var models_path = __dirname + "/app/models";
var walk = function(path){
	fs
	.readdirSync(path)
	.forEach(function(file){
		var newPath = path + '/' + file;
		var stat = fs.statSync(newPath);
		if(stat.isFile()){
			if(/(.*)\.(js|coffee)/.test(file)){
				require(newPath);
			}
		}else if(stat.isDirectory()){
			walk(newPath);
		}
	});
}
walk(models_path);


// 通过express内置的express.static可以方便地托管静态文件，例如图片、css、javascript文件等
// 将静态资源文件所在的目录作为参数传递给express.static中间件就可以提供静态资源文件的访问
App.use(express.static(path.join(__dirname,'public')));
//可以接受json参数
App.use(bodyParser.json());
//返回得到对象是一个键值对，当extended为false的时候，键值对中的值就为String或数组形式，为true时可以时任何形式
App.use(bodyParser.urlencoded({extended:true}));
//json格式化参数
// App.use(bodyParser.json());
App.use(cookieParser());
App.use(session({
	secret:'music',
	//cookie过期时间，毫秒
	cookie:{maxAge:1*60*60*1000},
	saveUninitialized:false,
 	resave:false,
 	store:new mongoStore({
	 	//数据库地址
	  	url:dbUrl,
	  	//collection名字
	  	collection: 'sessions'
  	})
}));
App.use(multipart());

App.locals.moment = require('moment');

//设置视图的根目录
App.set('views','./app/views/page');
//设置默认的模板引擎为jade
App.set('view engine','jade');

//打印日志，服务是否启动
console.log('web was started on the port ' + port);

require('./config/routes.js')(App);