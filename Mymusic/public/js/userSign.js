
$(function(){


//为表单必填文本框添加信息，选择form中的所有后代input进行遍历，当input元素中含有required类时，向input元素的.form-group增加
//创建的元素
	$("form :input.required").each(function(){
		var $required = $("<strong class='text-danger col-sm-1'>*</strong>");
		$(this).parents(".form-group").append($required);
	});

	//为表单添加失去焦点事件
	$("form :input.required").blur(function(){
		//获取父辈元素
		var parent = $(this).parents(".form-group");
		//如果发现有同类名元素出现，删除该元素
		parent.find('.msg').remove();
		// console.log("1");
		if($(this).is("#signName")){
			if($.trim(this.value) == ""){
				
				var msg = "必填";
				parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
			}else{
				var name = $("#signName").val();
				console.log(name);
				$.ajax({
					type:"POST",
					url:'/user/sign?name=' + name,
					success:function(data){
						if(data.name == 1){
							msg = "用户已存在";
							parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
						}else{
							parent.append("<span class='msg glyphicon glyphicon-ok-sign text-success',aria-hidden='true'></span>");
						}
					}
				});
			}
		}
		if($(this).is("#signPassword")){
			var pwd1 = $("#signPassword").val();
			var pwd2 = $("#signPassword2").val();
			if($.trim(this.value) == ""){
				
				var msg = "必填";
				parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
			}else{
				parent.append("<span class='msg glyphicon glyphicon-ok-sign text-success',aria-hidden='true'></span>");
			}
		}
		
		if($(this).is("#signPassword2")){
			var pwd1 = $("#signPassword").val();
			var pwd2 = $("#signPassword2").val();
			var msg;
			if(pwd1 !== pwd2 && pwd2 !== ""){
				msg = "请确保密码一致性!";
				parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
			}else if(pwd2 == ""){
				msg = "必填";
				parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
			}else if(pwd1 == pwd2){
				parent.append("<span class='msg glyphicon glyphicon-ok-sign text-success',aria-hidden='true'></span>");

			}
		}

		if($(this).is("#signEmail")){
			var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/g;
			var msg ;
			if($.trim(this.value) == ""){
				
				msg = "必填";
				parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
			}else if(!reg.test($(this).val())){
				msg = "请输入正确的email!";
				parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
			}else{
				parent.append("<span class='msg glyphicon glyphicon-ok-sign text-success',aria-hidden='true'></span>");
			}
		}

		// if($(this).is("#write")){
		// 	// alert("1");
		// 	if($.trim(this.value) == ""){
				
		// 		msg = "必填";
		// 		parent.append("<span class='msg error text-danger col-sm-2 col-sm-offset-1'>" + msg + "</span>");
		// 	}

		// }
		// if($(this).is("#signPhone")){
		// 	var msg = "必填";
		// 	var reg = /^1[34578]\d{9}$/;
		// 	if($.trim(this.value) == ""){
				
		// 		msg = "必填";
		// 		parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
		// 	}else if(!reg.test($(this).val())){
		// 		msg = "请输入正确的手机号";
		// 		parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
		// 	}else{
		// 		parent.append("<span class='msg glyphicon glyphicon-ok-sign text-success',aria-hidden='true'></span>");
		// 	}
		// }

	}).keyup(function(){
		//triggerHandler防止事件执行完后，浏览器自动为标签获得检点
		$(this).triggerHandler("blur");
	}).focus(function(){
		$(this).triggerHandler("blur");
	});

	$("#send").click(function(){
		// if(ischange == false){
			$("form :input.required").trigger("blur");
			var number = $('form .error').length;
			if(number){
				return false;
			}
			if(isclick == false){
				// alert("1")
				return false;
			}
		// }
		
	});
	var isclick = false;
	$("#sendemail").click(function(){
		isclick = true;
		var email = $("#signEmail").val();
		var parent = $("#signEmail").parents(".form-group");
		var msg ;
		parent.find('.msg').remove();
		if(email == ""){
			msg = "邮箱不能为空";
			parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
		}else{
			var istrue = check_email(email);
			if(istrue){
				$.post("/sendemail",{email:email},function(data){
					var statu = data.success;
					var parent = $("#write").parents('.form-group');
					var msg;
					parent.find('.msg').remove();
					if(statu == 2){
						parent.find('.msg').remove();
						msg = "邮件已发送";
						parent.append("<span class='msg  text-success col-sm-2 col-sm-offset-1'>" + msg + "</span>");
						var code = data.code;//获取验证码
						$("#write").blur(function(){
							if($.trim(this.value) == ""){
								msg = "验证码不能为空";
								parent.append("<span class='msg error text-danger col-sm-2 col-sm-offset-1'>" + msg + "</span>");
							}else{
								if($.trim(this.value) == code){
									msg = "通过验证";
									parent.append("<span class='msg  text-success col-sm-2 col-sm-offset-1'>" + msg + "</span>");
								}else{
									msg = "验证码错误";
									parent.append("<span class='msg error text-danger col-sm-2 col-sm-offset-1'>" + msg + "</span>");
								}
							}
						});
					}else{
						msg = "邮件发送失败";
						parent.append("<span class='msg error text-danger col-sm-2 col-sm-offset-1'>" + msg + "</span>");
					}
				});
			}else{
				msg = "请输入正确的email!";
				parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
			}
			
		}
		
	});

	return 0;
});


function check_email(email){
	var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/g;
	return reg.test(email);

}
