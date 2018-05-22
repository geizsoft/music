var History = require('../models/history');
var Music = require('../models/music');
var Category = require('../models/category');
//存储用户听过的音乐的权值
exports.save = function(req,res){
	// var save = req.query.save;
	var id = req.body.id;
	var singer = req.body.singer;
	// console.log(req.body);
	var user = req.session.user;
	if(user){
		History.find({user:user._id,music:id},function(err,history){
	// 		// console.log("@@@@@@@@@@@");
			if(err){
				console.log(err);
			}
			//如果数据不存在，创建新的数据
			if(history.length == 0){
				//查询音乐分类
				Music.find({_id:id})
					.populate({path:'category',
						select:'name'
					})
					.exec(function(err,music){
						var hisObj = {
							user:user._id,
							music:id,
							singer:singer,
							category:music[0].category.name,
							listen:1
						}
						var _history = new History(hisObj);
						_history.save(function(err,history){
							// console.log(history);
						});
					});
			}else{
				if(history[0].listen == 1){
					history[0].count += 1;
					history[0].save();
				}else{
					history[0].listen = 1;
					history[0].save(function(err,history){

					});
				}
				
			}

		});
	}

	res.json({success:1});

}

//存储用户收藏的音乐权值
exports.collect = function(req,res){
	//音乐id
	var id = req.body.musicId;
	// console.log(req.body);
	// var singer = req.body.singer;
	//用户
	var user = req.session.user;
	if(user){
		History.find({user:user._id,music:id},function(err,history){
			console.log(history.length == 0);
			if(history.length == 0){
				Music.find({_id:id})
					.populate({path:'category',
						select:'name'
					})
					.exec(function(err,music){
						// console.log(music);
						var hisObj = {
							user:user._id,
							music:id,
							singer:music[0].singer,
							category:music[0].category.name,
							collect:2
						}
						// console.log(hisObj);
						var _history = new History(hisObj);
						_history.save();
					});
					res.json({success:1});
			}else{
				// console.log(history[0].collect);
				if(history[0].collect == 2){
					history[0].collect = 0;
					var a = history[0];
					a.save();
					res.json({success:0});
				}else{
					history[0].collect = 2;
					var a = history[0];
					a.save();
					res.json({success:1});
				}
				
			}
		});
	}
	
}
//存储循环权重
exports.continue = function(req,res){
	//音乐id
	var id = req.body.id;
	var user = req.session.user;
	if(user){
		History.find({user:user._id,music:id},function(err,history){
			if(history[0].count == 3){
				history.continue = 3;
				history.save();
			}
			
		});
	}
}
exports.collection = function(req,res){
	var id = req.session.user._id;
	var userName = req.session.user.name;
	var count = 10;
	var page = parseInt(req.query.p,10) || 0;
	var index = page * count;
	var p = req.query.p;
	if(p == undefined){
		History.find({user:id})
		.populate('music','id title singer')
		.exec(function(err,musics){
			// console.log(musics);
			var results = musics.slice(index,index + count);
			res.json({
				currentPage:(page + 1),
				totalPage:Math.ceil(musics.length / count),
				musics:results
			});
		});
	}else{
		History.find({user:id})
			.populate('music','id title singer')
			.limit(count)
			.skip(index)
			.exec(function(err,musics){
				res.json({
					musics:musics
				});
			});
	}

	var cate = [{category:"流行"},{category:"古风"}];
	//升序排序
	History.find({$or:cate})
		.sort({"category":1})
		.exec(function(err,data){
			console.log(data);
		});

	// // //按照用户和category标签分组，将每项相加
	// History.aggregate([
	// 	{$group:{_id:{user:"$user",category:"$category"},
	// 	listen:{$sum:"$listen"},
	// 	collect:{$sum:"$collect"},
	// 	continue:{$sum:'$continue'},
	// 	comment:{$sum:"$comment"}
	// 	}},
	// 	{$project:
	// 		{_id:"$_id.user",
	// 		 category:"$_id.category",
	// 		total:{$sum:['$listen','$collect','$continue','$comment']}}
	// 	}
	// 	// {$group:{_id:"$_id",sum:{$sum:"$total"}}}
	// ])
	// .sort({"_id":-1})
	// .exec(function(err,data){
	// 	console.log("############");
	// 	console.log(data);
	// });
	// data(userName);
	// gethistory();
}
// function gethistory(){
// 	var getResult;
// 	getResult = History.find({})
// 					.exec()
// 					.then(function(promiseResult){
// 						//需要将结果返回
// 						console.log(promiseResult);
// 						return promiseResult;
// 					})
// 					.catch(function(error){
// 						return 'Promise Error:' + error;
// 					});
	
// 	// console.log(getResult);
// 	return getResult;
// }

exports.listenHis = function(req,res){
	var userId = req.session.user._id;
	History.find({user:userId,listen:1})
		.populate('music','id title singer')
		.limit(100)
		.sort({'count':-1})
		.exec(function(err,listen){
			res.render('users/listenHis',{
				title:'听歌记录',
				listen:listen
			});
		});
}
exports.collectHis = function(req,res){
	var userId = req.session.user._id;
	History.find({user:userId,collect:2})
		.populate('music','id title singer')
		.limit(100)
		.exec(function(err,collect){
			res.render('users/collectHis',{
				title:'收藏记录',
				collect:collect
			});
		});
}
exports.updateHis = function(req,res){
	var userId = req.session.user._id;
	Music.find({user:userId})
		.limit(100)
		.exec(function(err,musics){
			res.render('users/updateHis',{
				title:'上传记录',
				musics:musics
			});
		});
}