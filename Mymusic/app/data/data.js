var History = require('../models/history');
var Music = require('../models/music');
var Category = require('../models/category');

//从数据库中读出历史记录
function getHistory(){
	//1.获取当前用户


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
		// {$group:{_id:"$_id",sum:{$sum:"$total"}}}
	])
	.sort({"_id":-1})
	.exec(function(err,data){

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
				total:{$sum:['$listen','$collect','$continue','$comment'],
				category:"$category"}}
			},
			{$group:{_id:"$_id",sum:{$sum:"$total"}}}
		])
		.sort({"_id":-1})
		.exec(function(err,total){
			getdataWeight(data,total);
		});


	});


	
}

function getdataWeight(data,total){

	var userdata = new Array();
	for(var i = 0; i < total.length; i ++){
		var user = JSON.stringify(total[i]._id);
		var i_total = total[i];
		userdata[i] = [total[i]];
		for(var j = 0; j < data.length; j ++){
			var duser = JSON.stringify(data[j]._id);
			if(user == duser){
				data[j].total = Math.ciel(data[j].total / i_total.total);
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

	distance(userdata);
}

function distance(data){
	//获取到当前用户
	var current = req.session.user._id;
	var currentA;
	var distances = new Array();
	//判断用户是否登录
	if(currentUser){
		//找出当前用户的数据
		for(var i = 0; i < data.length; i ++){
			if(JSON.stringify(data[i][0]._id) == current){
				currentA = data[i];
			}
		}
		//将其他用户和当前用户比较
		for(var a = 0; a < data.length; a++){
			if(JSON.stringify(data[a][0]._id) !== JSON.stringify(currentA[0]._id)){
				var a = data[a].length;
				var s_data = data[a];
				var b = currentA.length;
				var len;
				var sum;
				if(a >= b){
					len = a;
				}else{
					len = b;
				}
				for(var k = 1; k < len ; k++){
					if(s_data[k] !== undefined && currentA[k] !== undefined){
						if(s_data[k].category == currentA[k].category){
							var number = s_data[k].total - currentA[k].total;
							sum += Math.pow(number,2);
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

				sum = Math.sqrt(sum);
				//存入两个用户之间的距离和用户名
				var dis = {
					sum:sum,
					user:s_data[0]._id
				}
				distances.push(dis);
			}
		}


	}
	//给数组排序，从小到大排序
	distances = distances.sort(des);
	//传入下一个程序中，进行下一步
	getSong(distances,current);
}

function des(a,b){
	return b.sum - a.sum;
}

function getSong(data,current){
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
	//取出用户的数据
	History.find({$or:users})
			.populate('music','id title')
			.sort({"user":-1})
			.exec(function(err,history){
				getCurrentdata(history,current)
			});
}
//获取当前用户数据
function getCurrentdata(history,current){
	History.find({user:current})
		.
}