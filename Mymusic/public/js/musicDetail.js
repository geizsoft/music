$(function(){
	

	$("#getmore").click(function(){
		// alert("we")
		$("#detail").css({
			"height":'1000px'
		});
		$("#lecs").css({
			"min-height":'800px'
		});
		$("#getmore").css({
			"display":"none"
		});
		$("#decline").css({
			"display":"block"
		});
	});
	$("#decline").click(function(){
		$("#detail").css({
			"height":'500px'
		});
		$("#lecs").css({
			"min-height":'300px'
		});
		$("#getmore").css({
			"display":"block"
		});
		$("#decline").css({
			"display":"none"
		});
	});

	a_click();
	a_likes();
	deletes();
	$("#sendComment").click(function(){
		var content = $("form #words").val();
		$("form #words").val("");
		//回复的用户的id号
		var to = $('form #toId').val();
		//评论的id号
		var cid = $("form #commentId").val();
		var music = $("form #commentMusic").val();
		//当前用户id
		var from = $("form #commentUser").val();
		// var urls;
		console.log("user" + from);
		var data;
		// alert(words);
		if(content == ""){
			return false;
		}
		if(to == undefined && cid == undefined){
			data = {
				"music":music,
				"from":from,
				"content":content
			}
			// urls = '/user/comment?musicId=' + musicId + "?userId=" + userId;
		}else{
			data = {
				"music":music,
				"from":from,
				"cid":cid,
				"to":to,
				"content":content
			}
			// urls = '/user/comment?musicId=' + musicId + "?userId=" + userId + "?commentId=" + commentId + "?toId=" + toId;
		}
	
		var datas = JSON.stringify(data);
		// console.log(datas);
		$.ajax({
			headers:{
				'Accept':'application/json',
				'Content-type':'application/json'
			},
			type:'POST',
			url:'/user/comment',
			data:datas,
			success:function(a){
				var time = new Date();
				var html;
				if(a.success == 1){
					var info = a.comments;
					//用户的名字
					var names = new Array();
					//用户的评论
					var contents = new Array();
					//评论的id
					var commentIds = new Array();
					//当前评论的用户id
					var fromId = new Array();
					//数据库返回的数据创建时间
					var time = new Array();
					for (var i in info){
						names[i] = info[i].from.name;
						contents[i] = info[i].content;
						commentIds[i] = info[i]._id;
						fromId[i] = info[i].from._id;
						time[i] = info[i].meta.createAt;
					}
					html = "<li class='media'><div class='pull-left'><img src='"+info[0].from.img+"' class='media-object img-thumbnail img-responsive' style='width:50px;'/>"  
							+ "</div><div class='media'><p><a>"+names[1]+"</a><span>:"+ contents[1]+"</span></p><div><span class='data text-muted'>"+ moment(time[1]).format('YYYY年MM月DD日 HH:mm') +"</span><div class='pull-right col-sm-2'>"
							+"<a class='btn btn-link clicks' data-id="+info[1].from._id+" data-coms="+info[1]._id+" id="+info[1]._id+">"
							+"<span class='glyphicon glyphicon-thumbs-up like'></span></a><a class='comment' href='#comments' data-cid="+commentIds[1]+" data-tid="+fromId[1]+">|回复</a>"
							+"<a class='delete' data-id="+info[1]._id+">删除</a></div><hr><div class='media-body'><p><a>@"+names[0]+"</a><span>:"+contents[0]+"</span></p><p class='text-muted'>"+moment(time[0]).format('YYYY年MM月DD日 HH:mm')+"</p></div></div><hr/>";
					$('#comArea').append(html);
					a_click();
					a_likes();
				}
				if(a.success == 2){
					// alert("2");
					// console.log(a.comment);
					var info = a.comment;
					// console.log(a.comment[0]._id+"##################");
					
					html = "<li class='media'><div class='pull-left'><img src='"+info[0].from.img+"' class='media-object img-thumbnail img-responsive' style='width:50px;'/>"  
							+ "</div><div class='media-body'><p><a>"+info[0].from.name+"</a><span>:"+ info[0].content+"</span></p><div><span class='data text-muted'>"+ moment(info[0].meta.createAt).format('YYYY年MM月DD日 HH:mm') +"</span><div class='pull-right col-sm-2'>"
							+"<a class='btn btn-link clicks' data-id="+info[0].from._id+" data-coms="+info[0]._id+" id="+info[0]._id+">"
							+"<span class='glyphicon glyphicon-thumbs-up like'></span></a><a class='comment' href='#comments' data-cid="+info[0]._id+" data-tid="+info[0].from._id+">|回复</a>"
							+"<a class='delete' data-id="+info[0]._id+">|删除</a></div></div><hr/>";
					$('#comArea').append(html);
					a_click();
					a_likes();
					// alert("1");
					// alert($("#comArea"));
				}
			}

		});
		return false;
	});

	var count = 1;
	$("#reply").change(function(){
		count += 1;
		console.log('success' + count);
	})

	$("#collect").click(function(){
		// alert("success");
		var target = $(this);
		var userId = target.data("uid");
		var musicId = target.data("mid");
		console.log(musicId);
		if(!userId){
			alert("请登录");
		}else{
			var data = {userId:userId,musicId:musicId};
			$.ajax({
				type:'POST',
				url:'/user/collect',
				data:data,
				success:function(a){
					if(a.success == 1){
						// alert("12");
						$('#collect span').addClass('text-danger');
					}
					if(a.success == 0){
						$('#collect span').removeClass('text-danger');
					}
				}
			});
		}
	});

	

});

function deletes(){
	$('.delete').click(function(e){
		// alert("1");
		var target = $(e.target);
		var id = target.data("id");
		var li = $(".item-id-" + id);
		console.log(li);
		$.ajax({
			type:'DELETE',
			url:'/comment/delete?id=' + id,
			success:function(data){
				if(data.success === 1){
					if(li.length > 0){				
						li.remove();
					}
				}
			}
		});
	});
}


function a_click(){
	$(".comment").click(function(event){
		// alert("12312");
		var target = $(this);
		var toId = target.data("tid");
		var commentId = target.data("cid");

		if($("#toId").length > 0){
			$("#toId").val(toId);
		}else{
			$("<input>").attr({
				type:'hidden',
				id:'toId',
				name:'comment[tid]',
				value:toId
			}).appendTo("#commentForm");
		}

		if($("#commentId").length > 0){
			$("#commentId").val(commentId);
		}else{
			$("<input>").attr({
				type:'hidden',
				id:'commentId',
				name:'comment[cid]',
				value:commentId
			}).appendTo("#commentForm");
		}


	});
}

function a_likes(){
	$("#comArea .clicks").click(function(){
		var target = $(this);
		var userid = target.data("id");
		var comid = target.data("coms");
		console.log(comid);
		var number = $(this).children(".like").html();
		var count = 0;
		if(number == " "){
			count = 0;
		}else{
			count = parseInt(number);
		}
		//传递到后台处理
		var datas = {
			userid:userid,
			comid:comid,
			count:count
		}
		datas = JSON.stringify(datas);
		$.ajax({
			headers:{
				'Accept':'application/json',
				'Content-type':'application/json'
			},
			type:'post',
			url:'/comment/like',
			data:datas,
			success:function(e){
				count = e.comment.like;
				console.log(e.comment.like);
				if(count == 0){
					$("#"+comid).children(".like").html(" ");
					$("#"+comid).children(".like").removeClass("text-danger");
				}else{
					$("#"+comid).children(".like").html(count);
					// $("#"+comid).addClass("text-danger")
					$("#"+comid).children(".like").addClass("text-danger");

				}
				// console.log(this);
			}
		});


		// // console.log(number);
		
		// if(number == " "){
		// 	$(this).children(".like").html("1");
		// }else{
		// 	number = parseInt(number);
		// 	$(this).children(".like").html(number+1);
		// }
		
	});


}

// //处理当前日期
// Date.prototype.format = function(str){
// 	var attr = {
// 		'M+':this.getMonth() + 1,//获取月份
// 		"d+":this.getDate(),//日
// 		"H+":this.getHours(),//小时
// 		"m+":this.getMinutes(),//分钟
// 		"s+":this.getSeconds(),//秒
// 		"q+":Math.floor((this.getMonth() + 3) /3 ),//季度
// 		"S":this.getMilliseconds()//毫秒
// 	}
// 	if(/(y+)/.test(str))
// 		str = str.replace(RegExp.$1,(this.getFullYear() + "" ).substr(4 - RegExp.$1.length) );
// 	for (var k in attr)  
//     if (new RegExp("(" + k + ")").test(str)) 
//     	str = str.replace(RegExp.$1, (RegExp.$1.length == 1) ? (attr[k]) : (("00" + attr[k]).substr(("" + attr[k]).length)));  
// 		return str;
	


// }
