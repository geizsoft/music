$(function(){
	$("#submitPwd").click(function(){
		$("form :input").trigger("blur");
		var number = $("form .errors").length;
		if(number){
			console.log(number);
			return false;
		}
	});

	$("form :input#password").blur(function(){
		var parent = $(this).parents(".form-group");
		parent.find('.msg').remove();
		var msg;
		if($.trim(this.value) == ""){
			msg = "密码不能为空";
			parent.append("<span class='msg errors text-danger col-sm-2'>"+msg+"</span>");
		}else{
			parent.append("<span class='msg glyphicon glyphicon-ok-sign text-success',aria-hidden='true'></span>");

		}
	});

	$("form :input#password1").blur(function(){
		var parent = $(this).parents(".form-group");
		parent.find('.msg').remove();
		var msg;
		if($.trim(this.value) == ""){
			msg = "密码不能为空";
			parent.append("<span class='msg errors text-danger col-sm-2'>"+msg+"</span>");
		}else{
			var pwd = $("form :input#password").val();
			var pwd1 = $("form :input#password1").val();
			if(pwd !== pwd1){
				msg = "两次输入密码不同";
				parent.append("<span class='msg errors text-danger col-sm-2'>"+msg+"</span>");

			}else{
				parent.append("<span class='msg glyphicon glyphicon-ok-sign text-success',aria-hidden='true'></span>");

			}

		}
	});
});