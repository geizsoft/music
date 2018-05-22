$(function(){


	$("form :input.require").each(function(){
		var required = $("<strong class='text-danger col-sm-1'>*</strong>");
		$(this).parents(".form-group").append(required);
	});

	$("form :input#logName").blur(function(){
		var parent = $(this).parents(".form-group");
		parent.find('.msg').remove();
		var msg;
		if($.trim(this.value) == ""){
				
			msg = "用户名不能为空";
			parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
		}else{
			var name = $("#logName").val();
			// console.log($("#logName").val());
			//通过异步请求查询用户名是否存在
			$.ajax({
				type:"POST",
				url:'/user/loginPage?name=' + name,
				success:function(data){
					// alert(data.name);
					if(data.name == 1){
						parent.append("<span class='msg glyphicon glyphicon-ok-sign text-success',aria-hidden='true'></span>");
					}else{
						msg = "用户不存在";
						parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
					}
				}
			});
		}
		
	});

	$("form :input#logPassword").blur(function(){
		var parent = $(this).parents(".form-group");
		parent.find('.msg').remove();
		var msg;
		if($.trim(this.value) == ""){
			msg = "密码不能为空";
			parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
		}else{
			parent.append("<span class='msg glyphicon glyphicon-ok-sign text-success',aria-hidden='true'></span>");
		}
	});

	$("#send").click(function(){
		$("form :input").trigger("blur");
		var number = $('form .error').length;
		if(number){
			return false;
		}
	});

});