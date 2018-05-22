$(function(){
	
	deletes();
	changerole();
	var url = "/admin/userlist";
	var style = "#menu";
	item_click(url,style);
});

function changerole(){
	$(".changerole").change(function(e){
		var value = $(e.target).val();
		var id = $(e.target).data("id");
		console.log(id);
		if (value == "修改权限"){

		}else{
			var data = {role:value,id:id}
			$.ajax({
				type:'POST',
				url:'/user/changeRole',
				data:data,
				success:function(data){
					// console.log(data);
					// console.log($(".item-id-" + id).children(".roles").val());
					$(".item-id-" + id).children(".roles").html(data.role);
				}
			});
		}
	});

}

function deletes(){
	$(".delete").click(function(e){
		var target = $(e.target);
		var id = target.data("id");
		// console.log("##############" + id);
		//获取tr元素的类
		var tr = $(".item-id-" + id);

		//异步请求
		$.ajax({
			type:'DELETE',
			url:'/admin/userlist?id=' + id,
			success:function(data){
				if(data.success === 1){
					if(tr.length > 0){
						tr.remove();
					}
				}
			}
		});
	});
}

function item_click(url,style){
	$('.item').click(function(e){
		
		// var count= 2;
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
				var users = data.users;
				var html = new Array();
				for(var i = 0; i < users.length; i++){
					var tr = "<tr class='item-id-"+users[i]._id+"'><td>"+
								users[i].name+"</td><td>"+
								moment(users[i].meta.createAt).format('YYYY/MM/DD')+"</td><td>"+
								users[i].email+"</td><td>"+
								users[i].phone+"</td><td>"+
								users[i].role+"</td><td>"+
								"<a href='#'>修改权限</a></td><td>"+
								"<button class='btn btn-danger delete' type='button' data-id="+users[i]._id+">删除</button></td><tr>";
					html.push(tr);
				}
				
				$(style + " tbody").append(html);
				deletes();
				$("#" + p).parent().addClass('active');
			}
		});
	});
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