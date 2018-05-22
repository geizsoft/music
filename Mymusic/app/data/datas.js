var History = require('../models/history');
var Music = require('../models/music');
var Category = require('../models/category');

function analyze(userId,res){
	History.find({user:userId},function(err,data){
		
	});
	getHisotry(userId,res);
	// console.log(res);
}
//获取历史记录
function getHisotry(userId,res){
	//按照用户和category标签分组，将每项相加,并且计算出用户在每个标签上的总权值
	//按照用户和category标签分组，将每项相加
	History.aggregate([
		{$group:{_id:{user:"$user",category:"$category"},
		listen:{$sum:"$listen"},
		collect:{$sum:"$collect"},
		continue:{$sum:'$continue'},
		comment:{$sum:"$comment"}
		}},
		{$project:
			{_id:"$_id.user",
			 category:"$_id.category",
			total:{$sum:['$listen','$collect','$continue','$comment']}}
		}
	])
	.sort({"_id":-1})
	.exec(function(err,data){
		// console.log(data);

		//计算出每个用户所有标签总的权值
		History.aggregate([
			{$group:{_id:{user:"$user",category:"$category"},
			listen:{$sum:"$listen"},
			collect:{$sum:"$collect"},
			continue:{$sum:'$continue'},
			comment:{$sum:"$comment"}
			}},
			{$project:
				{_id:"$_id.user",
				category:"$_id.category",
				total:{$sum:['$listen','$collect','$continue','$comment']}}
			},
			{$group:{_id:"$_id",sum:{$sum:"$total"}}}
		])
		.sort({"_id":-1})
		.exec(function(err,total){
			// console.log(total);
			getdataWeight(data,total,userId,res);
		});

	});
}

function getdataWeight(data,total,userId,res){
	// console.log(data);
	// console.log(total);

	var userdata = new Array();
	for(var i = 0; i < total.length; i ++){
		var user = JSON.stringify(total[i]._id);
		var i_total = total[i];
		userdata[i] = [total[i]];
		for(var j = 0; j < data.length; j ++){
			var duser = JSON.stringify(data[j]._id);
			if(user == duser){
				//保留两位小数
				data[j].total = Math.round(data[j].total / i_total.sum * 100) / 100;
				var single = {
					category:data[j].category,
					total:data[j].total
				}
				userdata[i].push(single);
			}else{
				continue;
			}
		}
	}

	// console.log(userdata);
	//得出的数据结构
	// [ [ { _id: 5ad980867ff94313f49081d4, sum: 8 },
	//     { category: '流行', total: 0.5 },
	//     { category: '民谣', total: 0.25 },
	//     { category: '古风', total: 0.25 } ],
	//   [ { _id: 5ad980607ff94313f49081d3, sum: 2 },
	//     { category: '流行', total: 1 } ],
	//   [ { _id: 5acefa93edbfdc12880fd169, sum: 4 },
	//     { category: '流行', total: 0.5 },
	//     { category: '古风', total: 0.5 } ] ]
	distance(userdata,userId,res);

}

function distance(data,userId,res){
	//获取到当前用户
	var current = userId;
	var currentA;
	var distances = new Array();
	//判断用户是否登录
	if(current){
		//找出当前用户的数据
		// console.log(current);
		// console.log(JSON.stringify(data[1][0]._id));
		// console.log(JSON.stringify(data[1][0]._id) == JSON.stringify(current));
		for(var i = 0; i < data.length; i ++){
			// console.log(data[i]);
			if(JSON.stringify(data[i][0]._id) == JSON.stringify(current)){
				currentA = data[i];
			}
		}

		// console.log(data[1][2] == data[0][5]); //undefined
		// console.log(currentA);
		// //将其他用户和当前用户比较
		for(var a = 0; a < data.length; a++){
			if(JSON.stringify(data[a][0]._id) !== JSON.stringify(currentA[0]._id)){	
				var s_data = data[a];
				// console.log(s_data);
				var alen = s_data.length;
				// console.log(alen);
				var blen = currentA.length;
				var len;
				var sum = 0;
				if(alen >= blen){
					len = alen;
				}else{
					len = blen;
				}
				// console.log(len);
				for(var k = 1; k < len ; k++){
					// console.log(s_data[k]);
					// console.log(currentA[k]);
					if(s_data[k] !== undefined && currentA[k] !== undefined){
						// console.log(typeof[s_data[k].total]);
						var auser = JSON.stringify(s_data[k]);
						var buser = JSON.stringify(currentA[k]);
						if(auser.category == buser.category){

							var number = s_data[k].total - currentA[k].total;
							// console.log(typeof(number));
							sum += Math.pow(number,2);
							// console.log(sum);
						}else{
							sum += Math.pow(s_data[k].total,2);
							sum += Math.pow(currentA[k].total,2);
						}
					}else if(s_data[k] == undefined && currentA[k] !== undefined){
						sum += Math.pow(currentA[k].total,2);
					}else if(s_data[k] !== undefined && currentA[k] == undefined){
						sum += Math.pow(s_data[k].total,2);
					}
					
				}
				// console.log(sum);
				//保留两位小数
				sum = Math.round(Math.sqrt(sum) * 100) / 100;
				// console.log(sum);
				//存入两个用户之间的距离和用户名
				var dis = {
					sum:sum,
					user:s_data[0]._id
				}
				distances.push(dis);
			}
		}


	}
	// console.log(distances.sort(des));
	//给数组排序，从小到大排序
	distances = distances.sort(des);
	//传入下一个程序中，进行下一步
	getSong(distances,current,res);
}

function des(a,b){
	return a.sum - b.sum;
}

function getSong(data,current,res){
	//如果数据多余5条，提取前5的数据
	if(data.length > 5){
		data = data.slice(0,6);
	}
	var users = new Array();
	for(var i = 0 ; i < data.length; i++){
		var a = {
			user:data[i].user
		}
		users.push(a);
	}
	
	History.aggregate([
		{$match:{$or:users}},
		{$group:{_id:"$music"}}
		]).limit(10).exec(function(err,data){
			Music.find({$or:data})
				.exec(function(err,music){
					Music.find({})
						.limit(10)
						.sort({"meta.createAt":-1})
						.exec(function(err,musics){
							res.render('users/musicIndex',{
								title:'首页',
								state:1,
								history:music,
								musics:musics
							});
						});
					
				});
		});



}


module.exports = analyze;