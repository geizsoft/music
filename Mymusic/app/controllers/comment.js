//加载编译的comment模型
var Comment = require('../models/comment');
var User = require('../models/user');
var History = require('../models/history');
var Music = require('../models/music');
//保存评论
exports.save = function(req,res){
	var data = req.body;
	var musicId = data.music;
	var userId = data.from;
	History.find({user:userId,music:musicId},function(err,history){
		if(history.length == 0){
			Music.find({_id:musicId})
				.populate({path:'category',
					select:'name'
				})
				.exec(function(err,music){
					var hisObj = {
						user:userId,
						music:musicId,
						singer:music[0].singer,
						category:music[0].category.name,
						comment:1
					}
				});
		}else{
			if(history[0].comment == 1){

			}else{
				history[0].comment = 1;
				history[0].save();
			}
		}
	});
	// // var comment = new Comment(_comment);
	// //判断是否有cid，如果有证明用户在回复
	if(data.cid){
	// 	Comment.findById(data.cid,function(err,comment){
	// 		var reply = {
	// 			from:data.from,
	// 			to:data.tid,
	// 			content:data.content
	// 		}
	// 		//在数组里新增一条回复的内容
	// 		comment.reply.push(reply);

	// 		comment.save(function(err,com){
	// 			if(err){
	// 				console.log(err);
	// 			}
	// 			console.log(com);

	// 			res.json({success:1});
	// // 			res.redirect('/music/' + musicId)
	// 		})
	// 	});
		// console.log(data.to);
		var reply = {
			music:data.music,
			from:data.from,
			to:data.to,
			cid:data.cid,
			content:data.content
		}
		var comment = new Comment(reply);
		comment.save(function(err,com){
			if(err){
				console.log(err);
			}
			var id = com.id;
			Comment
				.find({$or:[{_id:id},{_id:data.cid}]})
				.populate('from','name img')
				.exec(function(err,comments){
					// console.log("#####################");
					// console.log(comments);
					if(err){
						console.log(err);
					}

					res.json({success:1,comments:comments});
				});

		});
	}else{
		
		var comment = new Comment(data);
		comment.save(function(err,com){
			if(err){
				console.log(err);
			}
			// 同时在user表中查找用户姓名
			// console.log(comment);
			// var userId = comment.from;
			// User.findById(userId,function(err,user){
			// 	if(err){
			// 		console.log("UserError in comment.js" + err);
			// 	}
			// 	console.log(user.name);
			// })
			//从数据库中查询到用户名
			var id = com.id;
			// console.log("!!!!!!!" + id);
			Comment
				.find({_id:id})
				.populate('from','name img')
				.exec(function(err,comment){
					// console.log("##################"+comment);
					if(err){
						console.log(err);
					}
					res.json({success:2,comment:comment});

				});

		
			
	// 		res.redirect('/music/' + musicId);
		});

		// Comment
		// 	.find({form:data.from})
		// 	.populate('from',name)
		// 	.exec(function(err,comment){
		// 		console.log(comment);
		// 	});
	}




}

exports.savenumber = function(req,res){
	// console.log(req.body);
	var data = req.body;
	console.log(data.userid == req.session.user._id);
	var comid = data.comid;
	
	var position = 0;
	Comment.findById(comid,function(err,com){
		var isexert = false;
		// console.log(com.userlike);
		if(com.userlike == []){
			com.userlike.push(data.userid);
			com.like = data.count + 1;
		}else{
			var likes = com.userlike;
			for(var i in likes){
				if(likes[i] == data.userid){
					isexert = true;
					position = i;
					break;
				}
			}
			// console.log(isexert);
			if(isexert == false){
				com.userlike.push(data.userid);
				com.like = data.count + 1;
			}else{
				com.userlike.splice(0,1);
				console.log(com.userlike);
				com.like = data.count - 1;
			}
		}
		// console.log(com);
		com.save(function(err,comment){
			if(err){
				console.log(err);
			}
			res.json({comment:comment});
		});
	});
}
//删除评论
exports.delete = function(req,res){
	//通过query获取增加参数形式传递的id
	var id = req.query.id;
	// console.log(id);
	if(id){
		Comment.remove({_id:id},function(err,comment){
			if(err){
				console.log(err);
			}else{
				res.json({success:1});
			}
		});
	}
}