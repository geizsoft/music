var Music = require('../models/music');
var Category = require('../models/category')
var History = require('../models/history');
var analyze = require('../data/datas')

// 登录时将用户名和密码和session中的登录的用户对比，如果有则证明用户在其他地方登录,除去该用户登录的session
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";
//主页后台代码
//index首页
exports.index = function(req,res){
	// MongoClient.connect(url,function(err,db){
	// 	var dbo = db.db("music");
	// 	var user = "user1";
	// 	dbo.collection('sessions').find({session:{$regex:user}}).toArray(function(err,result){
	// 		// var session = JSON.parse(result[0].session);
	// 		// console.log(result);
	// 		// console.log(session.user.name);
	// 		db.close();
	// 	});
	// });
	// console.log(req.session);
	if(req.session.user){
		var a = [];
		// console.log(a == undefined);
		var userId = req.session.user._id;
		History.find({user:userId})
				.exec(function(err,data){
					if(data.length <= 0){
						Music.find()
						.limit(10)
						.sort({"meta.createAt":-1})
						.exec(function(err,musics){
							//1.如果没有登录，推荐为点击最多的
							Music.find()
								.limit(10)
								.sort({'click':-1})
								.exec(function(err,musics1){
									res.render('users/musicIndex',{
										title:'music 首页',
										state:0,
										musics:musics,
										musics1:musics1
									});
								})
							
						});
						}else{
							analyze(userId,res);
						}
					})
		


	}else{
		Music.find()
			.limit(10)
			.sort({"meta.createAt":-1})
			.exec(function(err,musics){
				//1.如果没有登录，推荐为点击最多的
				Music.find()
					.limit(10)
					.sort({'click':-1})
					.exec(function(err,musics1){
						res.render('users/musicIndex',{
							title:'music 首页',
							state:0,
							musics:musics,
							musics1:musics1
						});
					})
				
			});
	}
		
}

exports.analyze = function(req,res){

}

exports.search = function(req,res){
	// console.log(req.query);
	var catId = req.query.cat;
	var q = req.query.q;
	if(q == ""){
		res.redirect('/');
	}else{
	var page = parseInt(req.query.p,10) || 0;
	var count = 10;
	var index = page * count;
	//分类查询后的分页查询
	if(catId){
		Category
			.find({_id:catId})
			.populate({path:'musics',
				select:'title poster'
		})
			.exec(function(err,categories){
				if(err){
					console.log(err);
				}
				// console.log(categories);
				var category = categories[0] || {};
				var musics = category.musics || {};
				var results = musics.slice(index,index + count);

				res.render('users/results',{
					title:'结果界面',
					keyword:category.name,
					currentPage:(page + 2),
					query:'cat=' + catId,
					totalPage:Math.ceil(musics.length / 2),
					musics:results
				});

			});
	}else{
		//歌曲名查询
		Music
			.find({title:new RegExp(q + ".*", "i")})
			.exec(function(err,musics){
				if(err){
					console.log(err);
				}
				if(musics == 0){
					//歌手查询
					Music
						.find({singer:new RegExp(q + ".*","i")})
						.exec(function(err,_musics){
							if(err){
								console.log(err);
							}
							// console.log(musics);
							//分类查询
							if(_musics == 0){
								Category
									.find({name:new RegExp(q + ".*","i")})
									.populate({path:'musics',
										select:'id title singer'
								})
									.exec(function(err,category){
										// console.log(category[0].musics);
										if(err){
											console.log(err);
										}
										if(category !== 0){

										
										var musics = category[0].musics;
										
										var results = musics.slice(index,index + count);

										res.render('users/results',{
											title:'结果界面',
											keyword:q,
											currentPage:(page + 1),
											query:'q=' + q,
											totalPage: Math.ceil(musics.length / count),
											musics:results
										});
									}
									});
							}else{
								var results = _musics.slice(index,index + count);
								// console.log(Math.ceil(musics.lenght / count));
								res.render('users/results',{
									title:'结果界面',
									keyword:q,
									currentPage:(page + 1),
									query:'q=' + q,
									totalPage: Math.ceil(_musics.length / count),
									musics:results
								});
							}
						});
				}else{
					var results = musics.slice(index,index + count);
					// console.log(Math.ceil(musics.length / count));

					res.render('users/results',{
						title:'结果界面',
						keyword:q,
						currentPage:(page + 1),
						query:'q=' + q,
						totalPage: Math.ceil(musics.length / count),
						musics:results
				});
				}
			});
	}
}
}
//查询所有音乐
exports.allMusic = function(req,res){
	var count = 20;
	// var skip = 0;
	var page = parseInt(req.query.p,10) || 0;
	var index = page * count;
	// console.log(req.query.p);
	var p = req.query.p;
	// console.log(p == undefined);
	// console.log(page);
	if(p == undefined){


		Music.find(function(err,musics){
			// console.log(musics);
			var results = musics.slice(index,index + count);
			// console.log(results);
			Category.find({},function(err,categories){
				res.render('users/all',{
					title:'所有音乐',
					categories:categories,
					currentPage:(page + 1),
					totalPage: Math.ceil(musics.length / count),
					musics:results
				});
			});
			

		});
	}else{
		Music.find({})
			.limit(count)
			.skip(index)
			.exec(function(err,musics){
				// console.log(musics);
				res.json({musics:musics});
			});
	}
}

exports.getCateMusic = function(req,res){
	var id = req.body.id;
	console.info(id);
	Category.find({_id:id})
	.populate('musics','id title singer')
	.exec(function(err,categories){
		res.json({success:1,cate:categories});
	});
}

exports.musicPage = function(req,res){

}

