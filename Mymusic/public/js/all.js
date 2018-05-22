$(function(){
	var isClick = false;
	$(".choice").click(function(){
		if(isClick == false){
			$(".categories").css("display","block");
			isClick = true;
		}else{
			$(".categories").css("display","none");
			isClick = false;
		}
	});
	$("#alls").click(function(){
		$(".categories").css("display","none");
		isClick = false;
		var p = 0;
		$.ajax({
			type:'post',
			url:'/all/page?p=' + p,
			success:function(data){
				// console.info(data.musics);
				$(".cateName").html("全部");
				var musics = data.musics;
				var list = new Array();
				$(".ul-list").empty();
				for(var i = 0; i < musics.length; i++){
					list[i] ="<li><a href='/music/"+musics[i]._id+"'>"+musics[i].title
					+"</a> - <a href='/music/singer/"+musics[i].singer+"'>"+musics[i].singer+"</a></li>";
				}
				$(".ul-list").append(list);
			}
		})
	});
	$(".cate-item").click(function(e){
		$(".categories").css("display","none");
		isClick = false;
		var target = $(e.target);
		var id =  target.data("id");
		var cateId = {id:id};
		$.ajax({
			type:'post',
			url:'/musicCate',
			data:cateId,
			success:function(data){
				var name = data.cate[0].name;
				$(".cateName").html(name);
				var musics = data.cate[0].musics;
				$(".ul-list").empty();
				var list = new Array();
				if(musics.length > 0){
					for(var i = 0; i < musics.length; i++){
						list[i] ="<li><a href='/music/"+musics[i]._id+"'>"+musics[i].title
						+"</a> - <a href='/music/singer/"+musics[i].singer+"'>"+musics[i].singer+"</a></li>";
					}
				}
				$(".ul-list").append(list);
			}
		});
	});
	// $('.item').click(function(e){
	// 	// console.log(e.target);
	// 	// alert("1");
	// 	var count= 2;
	// 	var target = $(e.target);
	// 	// alert(target.data("id"));
	// 	var p = target.data("id");
	// 	// console.log(p);
	// 	var total = target.data("total");
	// 	// console.log(total);
	// 	var lis = new Array();
	// 	if( p >= 3 && p < p < 7){
	// 		$(".pageul ul li").remove();
	// 		var lli = "<li><a href='#'>&laquo;</a></li>";
	// 		lis.push(lli);
	// 		for(var i = 0; i <= p ;i++){
	// 			var li;
	// 			if(i == p - 2){
	// 				li = "<li><span>...</span></li>";
	// 			}else{
	// 				li = "<li><a class='item' data-id="+i+" data-total="+total+">"+ (i + 1)+"</a></li>";
	// 			}
	// 			lis.push(li);
	// 		}
	// 		if(p + 1 == total - 3){
	// 			for(var i = p + 1; i < total;i++ ){
	// 				var li;
	// 				li = "<li><a class='item' data-id="+i+" data-total="+total+">"+ (i + 1) +"</a></li>";
	// 				lis.push(li);
	// 			}
	// 		}else{
	// 			for(var i = p + 1; i < p + 2; i++){
	// 				var li;
	// 				li = "<li><a class='item' data-id="+i+" data-total="+total+">"+ (i + 1) +"</a></li>";
	// 				lis.push(li);
	// 			}
	// 			var span = "<li><span>...</span></li>";
	// 			lis.push(span);
	// 			for(i = total - 2;i < total; i++ ){
	// 				var li;
	// 				li = "<li><a class='item' data-id="+i+" data-total="+total+">"+ (i + 1) +"</a></li>";
	// 				lis.push(li);
	// 			}
	// 		}
	// 		var rli = "<li><a href='#'>&raquo;</a></li>";
	// 		lis.push(rli);
	// 		$(".pageul ul").append(lis);
	// 	}



	// 	$.ajax({
	// 		type:'POST',
	// 		url:'/all/page?p=' + p,
	// 		success:function(data){
	// 			console.log(data.musics);
	// 			// console.log(e.target);
	// 			$("#menu ul li").remove();
	// 			var html = new Array();
	// 			for(var i = 0; i < data.musics.length; i++){
	// 				var li = "<li>"+data.musics[i].title+"</li>";
	// 				html.push(li);
	// 			}
	// 			$("#menu ul").append(html);
	// 			$(".item").parent().removeClass('active');
	// 			$(e.target).parent().addClass('active');
	// 		}
	// 	});
	// });
	item_click();
	$("#navbar li:first-child").removeClass("active");
	$("#navbar .left li:nth-child(2)").addClass("active");
});

function item_click(){
	$('.item').click(function(e){
		
		var count= 2;
		var target = $(e.target);
		var p = target.data("id");
		var total = target.data("total");
		$.ajax({
			type:'POST',
			url:'/all/page?p=' + p,
			success:function(data){
				// console.log(data.musics);
				// console.log(e.target);
				changePage(p,total);
				$("#menu .ul-list li").remove();
				var html = new Array();
				for(var i = 0; i < data.musics.length; i++){
					var li = "<li ><a href='/music/"+data.musics[i]._id+"'>"+data.musics[i].title +"</a>" + " - "+"<a href='/music/singer/"+data.musics[i].singer+"'>"+ data.musics[i].singer +"</a></li>";
					html.push(li);
				}
				$("#menu .ul-list").append(html);

				$("#" + p).parent().addClass('active');
			}
		});
	});
}

function changePage(p,total){
	var lis = new Array();
	// console.log(p);
	if(total > 5){
		if(p == 1 || (p > total - 3 && p < total - 1)){
			$(".item").parent().removeClass('active');
			$("#" + p).parent().addClass('active');
		}else{
			if( p >= 2 &&  p < total - 2){
					$(".pageul ul li").remove();
					var lli = "<li><a href='#'>&laquo;</a></li>";
					lis.push(lli);
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
					var rli = "<li><a href='#'>&raquo;</a></li>";
					lis.push(rli);
					$(".pageul ul").append(lis);
					item_click();
					$("#"+p).parent().addClass('active');
					
			}else if(p == total - 1){
				$(".pageul ul li").remove();
					var lli = "<li><a href='#'>&laquo;</a></li>";
					lis.push(lli);
					var li = "<li><a id='0' class='item' data-id='0' data-total="+total+">1</a></li>";
					lis.push(li);
					var span = "<li><span>...</span></li>";
					lis.push(span);
					for(var i = total -4; i < total; i++){
						var li;
						li = "<li><a id="+i+" class='item' data-id="+i+" data-total="+total+">"+ (i + 1) +"</a></li>";
						lis.push(li);
					}
					var rli = "<li><a href='#'>&raquo;</a></li>";
					lis.push(rli);
					$(".pageul ul").append(lis);
					item_click();
					$("#"+p).parent().addClass('active');
			}else if(p == 0){
				// alert("sdasd");
				$(".pageul ul li").remove();
					var lli = "<li><a href='#'>&laquo;</a></li>";
					lis.push(lli);
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
				var rli = "<li><a href='#'>&raquo;</a></li>";
				lis.push(rli);
				$(".pageul ul").append(lis);
				item_click();
				$("#"+p).parent().addClass('active');
			}
		}
	}else  if(total <= 5){
		$(".item").parent().removeClass('active');
		$("#" + p).parent().addClass('active');
		}
}