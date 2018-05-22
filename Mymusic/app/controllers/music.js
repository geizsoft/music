var Music = require('../models/music');
var Comment = require('../models/comment');
var Category = require('../models/category');
var History = require('../models/history');
//underscore内的extend方法可以实现用另外一个对象内的新的字段来替换老的对象里对应的字段
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var buf = new Buffer(2018);


//音乐详情页面
exports.detail = function(req,res){
	//拿到req中的id，通过id来查询单条数据
	if(req.session.music){
		// console.log("req.session.music");
		// console.log(req.session.music.length);
	}
	var id = req.params.id;
	var user = req.session.user;
	Music.find({_id:id})
		.populate('category','name')
		.exec(function(err,music){
		if(err){
			console.log(err);
		}
		// console.log(music[0].lrc);
		// var url = path.join(__dirname,'../../','public',music[0].lrc);
		// console.log(url);
		var music = music[0];
		// fs.open(url,'r+',function(err,fd){
		// 	if(err){
		// 		return console.log(err);
		// 	}
		// 	console.log("文件打开成功");
		// 	var lrc = fd;
		// 	console.log(fd);
			// fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
				// if(err){
				// 	console.log(err);
				// }
				// console.log(bytes + "字节被读取");
				// if(bytes > 0){
				// 	// console.log(buf.slice(0,bytes).toString());
				// 	var lyricStr = buf.slice(0,bytes).toString();
				// }
				
				// 匹配歌词文本中的换行符.制表符  
           		//  var regexTrim = new RegExp("[\\r\\n]", "g"); 

           		//   // 匹配歌词文本中的时间  例如 [00:04.11]， 这种写法比较流氓，虽然可行。但只能匹配99分钟之内的时间格式 [99.04.11]  
	            // var regexGetTime = new RegExp("\\[.{8}\\]", "g");   
	            // // 匹配歌词文本中的歌词  例如 刘瑞琦 - 晴天  
	            // var regexGetLyric = new RegExp("[^\\[\\]\\:\\.\\d]+", "g");  
	            // // 用于存放时间  
	            // var aTime = [];   
	            // // 用于存放歌词     
	            // var aLyric = [];      
	            // // 存放json对象 例如 {"time": "4.11", "lyric": "刘瑞琦 - 晴天"}  
	            // var jsonLyric = [];   
	            // var result;  
	  
	            // // 删除歌词文本中的所有换行符.制表符  
	            // var lyricStr2 = lyricStr.replace(regexTrim, ''); 
	            // // 将匹配到的时间存入数组，exec()返回的是数组，该数组只存放每一次匹配到的值。  
	            // while((result=regexGetTime.exec(lyricStr2)) != null) {   
	            //     aTime.push(result.toString());  
	            // }  
	  
	            // // 将匹配到的歌词存入数组  
	            // while((result=regexGetLyric.exec(lyricStr2)) != null) {  
	            //     aLyric.push(result.toString());  
	            // }                     
	  
	            // for(var i=0, j=aTime.length; i<j; i++) {  
	            //     var obj = {};  
	            //     obj.lyric = aLyric[i];  
	            //     obj.time = getTime(aTime[i]);  
	            //     jsonLyric.push(obj);  
	            // }     
	  
	            // 打印json数组  
	            // console.log(jsonLyric); 


	            Comment
				.find({music:id})
				.populate('from','name img')
				.populate('to','name')
				.populate('cid','content meta')
				.exec(function(err,comments){
					// console.log(comments);
					if(user){
						History.find({user:user._id,music:id})
							.exec(function(err,history){
								res.render('users/musicDetail',{
									title:music.title,
									music:music,
									comments:comments,
									collect:history,
									// jsonLyric:jsonLyric
									// user:user
								});
						});
					}else{
						// console.log(jsonLyric);
						res.render('users/musicDetail',{
							title:music.title,
							music:music,
							comments:comments,
							user:'',
							// jsonLyric:jsonLyric
						});
					}
				});


				// fs.close(fd,function(err){
				// 	console.log("文件关闭");
				// })
			// });
		// });
		// fs.readFile(url, 'r+',function(err,data){
		// 	if(err){
		// 		console.log(err);
		// 	}
		// 	console.log("11");
		// 	// console.log(data.toString);
		// });
	
	});
	
}

 // 将 [00:04.11] 转化为 4.11(以 秒.毫秒 格式)   
    function getTime(time) {          
        var str = time;   
        // 删除 '['  
        str = str.substr(1);  
        // 删除 ']'  
        str = str.substr(0, str.length-1);    
        var minutes = parseInt(str.slice(0, str.indexOf(':')));  
        var seconds = parseFloat(str.substr(str.indexOf(':')+1));  
        var newTime = (minutes*60 + seconds).toFixed(2);  
        return newTime;   
    }  

//音乐录入页面
exports.new = function(req,res){
	Category.find({},function(err,categories){
		// console.log(categories);
		res.render('users/musicAdmin',{
			title:'music 录入页面',
			music:{},
			categories:categories
		});
	});
	
}


//数据跟新
exports.update = function(req,res){
	var id = req.params.id;
	if(id){
		Music.findById(id,function(err,music){
			Category.find({},function(err,categories){
				res.render('users/musicAdmin',{
					title:'更新页面',
					music:music,
					categories:categories
				});
			});
			
		});
	}
}

//保存文件
exports.saveMusic = function(req,res,next){
	// console.log(req.files.inputUpSong.type);
	if(req.files.inputUpSong.size !== 0 && req.files.inputUpSong.type == 'audio/mp3'){
		var id = req.body.music._id;
		if(id){
			Music.findById(id,function(err,music){
				var song = music.song;
				var exp = new RegExp('^http');
				var isHttp = exp.test(song);
				if(isHttp == false){
					if(song == ""){
						var url = path.join(__dirname,'../../','public',song);
						fs.unlink(url,function(err){
							if(err){
								console.log(err);
							}else{
								console.log("删除成功");
							}
						});
					}
				}
			});
		}
		//获取音乐文件
		var musicData = req.files.inputUpSong;
		var filePath = musicData.path;
		var originalName = musicData.originalFilename;
		// console.log(musicData);
		if(originalName){
			fs.readFile(filePath,function(err,data){
				var timestamp = Date.now();
				var type = musicData.type.split('/')[1];
				// console.log(type);
				var newmusic = originalName.split('.')[0] + timestamp + "." + type;
				var music = originalName ;
				var newPath = path.join(__dirname,'../../','public/upload/music/' + newmusic);
				fs.writeFile(newPath,data,function(err){
					req.body.music.song = "/upload/music/" + newmusic ;
					next();
				});
				
			});
		}
	}else{
		next();
	}

	
}

exports.savePoster = function(req,res,next){
	// console.log(req.files.inputUp.type);
	if(req.files.inputUp.size !== 0 && req.files.inputUp.type == 'image/jpeg'){
		var id = req.body.music._id;
		if(id){
			Music.findById(id,function(err,music){
				var poster = music.poster;
				if(poster !== ""){
					var url = path.join(__dirname,'../../','public',poster);
					fs.unlink(url,function(err){
						if(err){
							console.log(err);
						}else{
							console.log("删除成功");
						}
					});
				}
			});
		}
		//获取图片文件
		var musicPoster = req.files.inputUp;
		//获取原始文件路径
		var filePath = musicPoster.path;
		//获取原始文件名字
		var originalName = musicPoster.originalFilename;
		if(originalName){
			fs.readFile(filePath,function(err,data){
				var timestamp = Date.now();
				var type = musicPoster.type.split('/')[1];
				var poster = timestamp + "." + type;
				var newPath = path.join(__dirname,'../../','public/upload/poster/' + poster);
				fs.writeFile(newPath,data,function(err){
					req.body.music.poster = "/upload/poster/" + poster;
					next();
				})
			});
		}
	}else{
		next();
	}
}

//表单提交后的数据处理逻辑
exports.save = function(req,res){
	var id = req.body.music._id;
	var musicObj = req.body.music;
	musicObj.user = req.session.user._id;
	// console.log(musicObj);
	//判断文件路径是否存在，不存在返回到录入页面
	if(!musicObj.song && !musicObj.category){
		// res.redirect("/upload/music");
		res.render('users/updateDefault',{
			title:"失败",
			error:'上传失败,请重新上传'
		});
	}else{
		var _music;
		//判断传递的数据是否是新增数据
		if(id){
			Music.findById(id,function(err,music){
				if(err){
					console.log(err);
				}
				console.log(music);
		// 		//将musicObj中的数据替换到music中
				_music = _.extend(music,musicObj);

				
		// 		var categories = musicObj;
				_music.save(function(err,music){
					if(err){
						console.log(err);
					}
					//重定向网页
					// res.redirect('/music/' + music._id);
				});
				Category.find({musics:_music._id},function(err,category){
					// console.log(category);
					// console.log(_music.category);
					// console.log(category[0]._id);
					// console.log(JSON.stringify(_music.category) == JSON.stringify(category[0]._id));
					if(JSON.stringify(_music.category) == JSON.stringify(category[0]._id)){
						console.log("true");
						res.redirect('/admin/list');
					}else{
						var musics = category[0].musics;
						musics.removeByValue(id);
						category[0].musics = musics;
						category[0].save();
						var categoryId = musicObj.category;
						Category.findById(categoryId,function(err,category0){
							category0.musics.push(_music._id);
							category0.save();
							res.redirect('/admin/list');
						});
					}
				});
			});
		}else{
			//调用模型的构造函数
			_music = new Music(musicObj);
			var categoryId = musicObj.category;
			_music.save(function(err,music){
					if(err){
						console.log(err);
					}
					// for(var i = 0; i < categories.length; i ++){
						Category.findById(categoryId,function(err,category) {
							category.musics.push(music._id);
							category.save();
						});
					// }
					res.redirect('/music/' + music._id);
			});
		}
	}
}


//音乐列表页的删除请求
exports.delete = function(req,res){
	//通过query获取增加参数形式传递的id
	var id = req.query.id;
	if(id){
		Music.find({_id:id})
			.populate('category','id')
			.exec(function(err,music){
				
				var cateId = music[0].category._id;
				//删除分类中的musicid
				Category.find({_id:cateId},function(err,cate){
					var musics = cate[0].musics;
					musics.removeByValue(id);
					cate[0].musics = musics;
					cate[0].save();
				});
				//删除music中的评论
				Comment.remove({music:id});
			});
		Music.remove({_id:id},function(err,music){

			if(err){
				console.log(err);
			}else{
				res.json({success:1})
			}
		});
		
		// res.json({success:0});
	}
}


exports.palyer = function(req,res){
	var id = req.body.id;
	// console.log(id);
	Music.findById(id,function(err,music){

		if(err){
			console.log(err);
		}
		//将点击量记录到数据库中
		music.click = music.click + 1;
		music.save();
		var musics;
		//将获取的数据添加到session中在服务器端传递
		if(req.session.music){

			var exert = false;
			musics = req.session.music;
			// console.log(musics);
			for(var i = 0; i < musics.length; i++){
				if(musics[i]._id == music._id){
					exert = true;
					// break;
				}
			}
			if(exert == false){
				musics.push(music);
				req.session.music = musics;
				res.json({success:1,music:music});
			}else{
				res.json({success:0});
			}
			
		}else{
			musics = new Array();
			musics.push(music);
			req.session.music = musics;
			res.json({success:1,music:music});
		}
		
		
		
	});

}
//简单的歌手搜索
exports.singer = function(req,res){
	var singer = req.params.singer;
	// console.log(singer);

	Music.find({singer:singer},function(err,musics){
		if(err){
			console.log(err);
		}
		// console.log(musics);
		res.render('users/musicSinger',{
			title:'歌手',
			musics:musics,
			singer:singer
		});
	})
}
//从服务器中的session端异步获取music数据
exports.getMusic = function(req,res){
	if(req.session.music){
		var musics = req.session.music;
		res.json({success:1,musics:musics});
	}else{
		res.json({success:0});
	}
}
//从服务器中的session端异步清空music数据
exports.musicDelete = function(req,res){
	if(req.session.music){
		req.session.music = [];
	}
	res.json({success:1});
}
//异步获取用户上传的音乐
exports.userUpload = function(req,res){
	var id = req.session.user._id;
	// console.log();
	var count = 10;
	var page = parseInt(req.query.p,10) || 0;
	var index = page * count;
	var p = req.query.p;
	if(p == undefined){
		Music.find({user:id},function(err,musics){
			var results = musics.slice(index,index + count);
			res.json({
				success:1,
				currentPage:(page + 1),
				totalPage:Math.ceil(musics.length / count),
				musics:results
			});
			// res.json({success:1,musics:musics});
		});
	}else{
		Music.find({user:id})
			.limit(count)
			.skip(index)
			.exec(function(err,musics){
				res.json({
					success:1,
					musics:musics
				});
			});
	}
	

}
//音乐列表页面
exports.list = function(req,res){
	var count = 20;
	var page = parseInt(req.query.p,10) || 0;
	var index = page * count;
	var p = req.query.p;
	if(p == undefined){
		Music.find({})
			.populate('category','name')
			.exec(function(err,musics){
			if(err){
				console.log(err);
			}
			console.log(musics);
			var results = musics.slice(index,index + count);
			res.render('admin/musicList',{
				title:'music 列表页面',
				totalPage:Math.ceil(musics.length / count),
				currentPage:(page + 1),
				musics:results
			});
		});	
	}else{
		Music.find({})
			.populate('category','name')
			.limit(count)
			.skip(index)
			.sort('meta.updateAt')
			.exec(function(err,musics){
				res.json({musics:musics});
			});
	}
	
}


Array.prototype.removeByValue = function(val){
	for(var i = 0; i < this.length; i++){
		if(this[i] == val){
			this.splice(i,1);
			break;
		}
	}
}


exports.uploadlrc = function(req,res){
	var id = req.params.id;
	// console.log(id);
	res.render('users/uploadlrc',{
		title:'上传歌词',
		id:id
	});
}
exports.uploadlrcs = function(req,res){
	// console.log(req.files);
	var id = req.body.music._id;
	// console.log(id);
	// Music.findById(id,function(err,music){
	// 	var lrc = music.lrc;
	// 	if(lrc !== ""){
	// 		var url = path.join(__dirname,"../../","public",lrc);
	// 		fs.unlink(url,function(err){
	// 			if(err){
	// 				console.log(err);
	// 			}
	// 		});
	// 	}
	// });

	var lrc = req.files.lrcs;
	// console.log(lrc);
	var filePath = lrc.path;
	var originalName = lrc.originalFilename;
	// console.log(lrc.originalFilename);
	// var type = lrc.originalFilename.split('.')[1];
	if(originalName){
		fs.readFile(filePath, function(err,data){
			var timestamp = Date.now();
			var type = lrc.originalFilename.split(".")[1];
			var lrcs = timestamp + "." + type;
			var newPath = path.join(__dirname,"../../","public/upload/lrc/" + lrcs);
			fs.writeFile(newPath, data, function(err){

			});
			Music.findById(id,function(err,music){
				music.lrc = "/upload/lrc/" + lrcs;
				music.save();
				// res.redirect('/music/:id');
			});
		});
	}


}