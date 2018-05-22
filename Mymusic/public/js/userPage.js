$(function(){
	// $(".nav-sidebar li").click(function(){
	// 	$(".nav-sidebar li").removeClass("active");
	// 	// $("div .page").removeClass("pageStyle");
	// 	// console.log($(this).attr("id"));
	// 	$(this).addClass("active");
	// 	if($(this).attr("id") == 'mine'){
	// 		$(".main .page").addClass('pageStyle');
	// 		$(".page1").removeClass("pageStyle");

	// 	}
	// 	// if($(this).attr("id") == 'set'){
	// 	// 	$(".main div").addClass('pageStyle');
	// 	// 	$(".page2").removeClass("pageStyle");

	// 	// }
	// 	if($(this).attr("id") == 'music'){
	// 		$(".main .page").addClass('pageStyle');
	// 		$(".page3").removeClass("pageStyle");
	// 		var htmls = new Array();
	// 		$('.page3 tbody').empty();
	// 		$(".page3 .pageul ul").empty();
	// 		$.post("/music/userUpload",function(data){
	// 			// console.log(data);
	// 			var musics = data.musics;
	// 			var current = data.currentPage;
	// 			var totalPage = data.totalPage;
				
	// 			// console.log(musics[0].meta.createAt);
	// 			for(var i in musics){
	// 				htmls[i] = "<tr><td><a href='/music/"+musics[i]._id+"' target='_blank'>"+musics[i].title+"</a></td><td><a href='/music/singer/"+musics[i].singer+"' target='_blank'>"+musics[i].singer+"</a></td><td>"+moment(musics[i].meta.createAt).format('YYYY年MM月DD日')+"</td></tr>"
	// 			}
	// 			$('.page3 tbody').append(htmls);
	// 			var lis = start_page(current,totalPage);
				
	// 			$(".page3 .pageul ul").append(lis);
	// 			var url = "/music/userUpload";
	// 			var style = ".page3";
	// 			item_click(url,style);
	// 		});
	// 	}
	// 	if($(this).attr("id") == 'collect'){
	// 		$(".main .page").addClass('pageStyle');
	// 		$(".page4").removeClass("pageStyle");
	// 		var htmls = new Array();
	// 		$('.page4 tbody').empty();
	// 		$(".page4 .pageul ul").empty();
	// 		$.post('/history/collect',function(data){
	// 			var musics = data.musics;
	// 			var current = data.currentPage;
	// 			var totalPage = data.totalPage;
	// 			for(var i in musics){
	// 				if(musics[i].collect == 2){
	// 					var td = "<tr><td><a href='/music/"+musics[i].music._id+"' target='_blank'>"+musics[i].music.title+"</a></td><td><a href='/music/singer/"+musics[i].music.singer+"' target='_blank'>"+musics[i].music.singer+"</a></td><td>"+moment(musics[i].meta.createAt).format('YYYY年MM月DD日')+"</td></tr>";
	// 					htmls.push(td);
	// 				}
	// 			}
	// 			$('.page4 tbody').append(htmls);
	// 			var lis = start_page(current,totalPage);
	// 			$(".page4 .pageul ul").append(lis);
	// 			var url = "/history/collect";
	// 			var style = ".page4";
	// 			item_click(url,style);
	// 		});

	// 	}

	// });
	//绑定3个板块，异步请求数据后显示该模块，填充数据，屏蔽其他模块
	$("#listen").click(function(){

	});


	$("#submit").click(function(){
		var obj = $("#changeUser").serializeArray();
		if(obj[0].value == ""){
			var parent = $("#userName").parents(".form-group");
			parent.find('.msg').remove();
			var msg = "不能为空";
			parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
			// alert("用户名不能为空");
		}else if(obj[1].value == ""){
			var parent = $("#userEmail").parents(".form-group");
			parent.find('.msg').remove();
			var msg = "不能为空";
			parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
			// alert("邮箱不能为空");
		// }else if(obj[2].value == ""){
			// var parent = $("#userPhone").parents(".form-group");
			// parent.find('.msg').remove();
			// var msg = "不能为空";
			// parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
			// alert("电话不能为空");
		}else{
			var data = {
				name:obj[0].value,
				email:obj[1].value,
				phone:obj[2].value,
				content:obj[3].value
			}
			console.log(data);
			$.ajax({
				type:'POST',
				url:'/user/update/name',
				data:data,
				success:function(da){
					if(da.success == 0){
						var parent = $("#userName").parents(".form-group");
						parent.find('.msg').remove();
						var msg = "昵称已经存在";
						parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
					}else{
						var parent = $(".userpostInfo");
						parent.find('.msg').remove();
						var msg = "保存成功";
						parent.append("<span class='msg error text-success col-sm-2'>" + msg + "</span>");
						setTimeout(function(){
							var parent = $(".userpostInfo");
							parent.find('.msg').remove();
						},2000);
					}
				}
			});
		}

	});
	setInterval(function(){
		var time = moment();
		var times = moment(time).format('YYYY-MM-DD hh:mm:ss')
		$("#changeTime").text(times);
	},1000);
	
	$("#navbar li:first-child").removeClass("active");

	// $(".hiss").click(function(e){
	// 	var target = $(e.target);
	// 	var id = target.data("id");
	// 	console.log(id);
	// 	$.ajax({
	// 		type:"POST",
	// 		url:'/user/userPage/getall?id=' + id,
	// 		success:function(e){
	// 			console.log(e);
	// 		} 
	// 	});
	// });

});



function item_click(url,style){
	$('.item').click(function(e){
		
		var count= 2;
		var target = $(e.target);
		var p = target.data("id");
		var total = target.data("total");
		$.ajax({
			type:'POST',
			url:url + '?p=' + p,
			success:function(data){
				changePage(p,total,url,style);
				$(style + ' tbody').empty();
				// var html = new Array();
				var musics = data.musics;
				if(style == '.page3'){
					var html = page3(musics);
				}else{
					var html = page4(musics);
				}
				
				// for(var i = 0; i < musics.length; i++){
				// 		var li =  "<tr><td><a href='/music/"+musics[i]._id+"' target='_blank'>"+musics[i].title+"</a></td><td><a href='/music/singer/"+musics[i].singer+"' target='_blank'>"+musics[i].singer+"</a></td><td>"+moment(musics[i].meta.createAt).format('YYYY年MM月DD日')+"</td></tr>";
					
				// 	html.push(li);
				// }
				$(style + " tbody").append(html);

				$("#" + p).parent().addClass('active');
			}
		});
	});
}
function page3(musics){
	var html = new Array();
	for(var i = 0; i < musics.length; i++){
		var li =  "<tr><td><a href='/music/"+musics[i]._id+"' target='_blank'>"+musics[i].title+"</a></td><td><a href='/music/singer/"+musics[i].singer+"' target='_blank'>"+musics[i].singer+"</a></td><td>"+moment(musics[i].meta.createAt).format('YYYY年MM月DD日')+"</td></tr>";
		html.push(li);
	}
	return html;
}
function page4(musics){
	var html = new Array();
	for(var i in musics){
		if(musics[i].collect == 2){
			var li = "<tr><td><a href='/music/"+musics[i].music._id+"' target='_blank'>"+musics[i].music.title+"</a></td><td><a href='/music/singer/"+musics[i].music.singer+"' target='_blank'>"+musics[i].music.singer+"</a></td><td>"+moment(musics[i].meta.createAt).format('YYYY年MM月DD日')+"</td></tr>";
			html.push(li);
		}
	}
	return html;
}

function changePage(p,total,url,style){
	var lis = new Array();
	// console.log(p);
	if(total > 5){
		if(p == 1 || (p > total - 3 && p < total - 1)){
			// alert("11")
			$(".item").parent().removeClass('active');
			$("#" + p).parent().addClass('active');
		}else{
			if( p >= 2 &&  p < total - 2){
					$(".pageul ul li").remove();
					// var lli = "<li><a href='#'>&laquo;</a></li>";
					// lis.push(lli);
					for(var i = 0; i <= p ;i++){
						var li;
						if(i == 0){
							li = "<li><a id="+i+" class='item' data-id="+i+" data-total="+total+">"+ (i + 1)+"</a></li>";
						}else
						if(i == p - 2 && i != 0){
							li = "<li><span>...</span></li>";
						}else
						if(i == p - 1 || i == p){
							li = "<li><a id="+i+" class='item' data-id="+i+" data-total="+total+">"+ (i + 1)+"</a></li>";
						}else{
							li = "";
						}

						lis.push(li);
					}
					if(p + 1 == total - 2){
						for(var i = p + 1; i < total;i++ ){
							var li;
							li = "<li><a id="+i+" class='item' data-id="+i+" data-total="+total+">"+ (i + 1) +"</a></li>";
							lis.push(li);
						}
					}else{
						for(var i = p + 1; i < p + 2; i++){
							var li;
							li = "<li><a id="+i+" class='item' data-id="+i+" data-total="+total+">"+ (i + 1) +"</a></li>";
							lis.push(li);
						}
						var span = "<li><span>...</span></li>";
						lis.push(span);
						for(i = total - 1;i < total; i++ ){
							var li;
							li = "<li><a id="+i+" class='item' data-id="+i+" data-total="+total+">"+ (i + 1) +"</a></li>";
							lis.push(li);
						}
					}
					// var rli = "<li><a href='#'>&raquo;</a></li>";
					// lis.push(rli);
					$(".pageul ul").append(lis);
					item_click(url,style);
					$("#"+p).parent().addClass('active');
					
			}else if(p == total - 1){
				$(".pageul ul li").remove();
					// var lli = "<li><a href='#'>&laquo;</a></li>";
					// lis.push(lli);
					var li = "<li><a id='0' class='item' data-id='0' data-total="+total+">1</a></li>";
					lis.push(li);
					var span = "<li><span>...</span></li>";
					lis.push(span);
					for(var i = total -4; i < total; i++){
						var li;
						li = "<li><a id="+i+" class='item' data-id="+i+" data-total="+total+">"+ (i + 1) +"</a></li>";
						lis.push(li);
					}
					// var rli = "<li><a href='#'>&raquo;</a></li>";
					// lis.push(rli);
					$(".pageul ul").append(lis);
					item_click(url,style);
					$("#"+p).parent().addClass('active');
			}else if(p == 0){
				// alert("sdasd");
				$(".pageul ul li").remove();
					// var lli = "<li><a href='#'>&laquo;</a></li>";
					// lis.push(lli);
				for(var i = 0; i < 4;i++){
					var li = "<li><a id="+i+" class='item' data-id="+i+" data-total="+total+">"+ (i + 1) +"</a></li>";
					lis.push(li);
				}
				var span = "<li><span>...</span></li>";
				lis.push(span);
				for(i = total - 1;i < total; i++ ){
					var li;
					li = "<li><a id="+i+" class='item' data-id="+i+" data-total="+total+">"+ (i + 1) +"</a></li>";
					lis.push(li);
				}
				// var rli = "<li><a href='#'>&raquo;</a></li>";
				// lis.push(rli);
				$(".pageul ul").append(lis);
				item_click(url,style);
				$("#"+p).parent().addClass('active');
			}
		}
	}else  if(total <= 5){
		$(".item").parent().removeClass('active');
		$("#" + p).parent().addClass('active');
		}
}
function start_page(current,totalPage){
	var lis = new Array();
	if(totalPage <= 5){
		for(var i = 0; i < totalPage; i++){
			var li;
			if(i == (current - 1)){
				li = "<li class='active'><a id="+i+" class='item' data-id="+i+" data-total="+totalPage+">"+(i+1)+"</a></li>";
			}else{
				li = "<li><a class='item' id="+i+" data-id="+i+" data-total="+totalPage+">"+(i+1)+"</a></li>";
			}
			lis.push(li);
		}
	}else{
		for(var i = 0; i < 4; i++){
			var li;
			if(current == (i+1)){
				li = "<li class='active'><a class='item' id="+i+" data-id="+i+" data-total="+totalPage+">"+(i+1)+"</a></li>";
			}else{
				li = "<li><a class='item' id="+i+" data-id="+i+" data-total="+totalPage+">"+(i+1)+"</a></li>";
			}
			lis.push(li);
		}
		var span = "<li><span>...</span></li>";
		lis.push(span);
		for(var i = totalPage - 1; i < totalPage; i++ ){
			var li;
			li = "<li><a class='item' id="+i+" data-id="+i+" data-total="+totalPage+">"+(i+1)+"</a></li>";
			lis.push(li);
		}
	}
	return lis;
}