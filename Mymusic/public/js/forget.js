$(function(){
	var Dname;
	$("#submitName").click(function(){
		// alert($("#userName input").val());
		var span;
		var name = $("#userName input").val();
		var names = {name:name};
		var parent = $("#userName input").parents(".form-group");
		parent.find('.msg').remove();
		// console.log(name);
		// console.log(name.length);
		if(name.length == 0){
			span = "<span class='msg text-danger col-sm-3'>请填写用户名</span>";
			parent.append(span);
		}else{
			$.ajax({
				type:"POST",
				url:"/user/postName",
				data:names,
				success:function(data){
					
					if(data.success == 0){
						span = "<span class='msg text-danger col-sm-3'>请填写正确的用户名</span>";
						parent.append(span);
					}else{
						Dname = name;
						$("#useremail").css({
							"display":"block"
						});
						$("#userName").css({
							"display":"none"
						});
					}
				}
			});
		}

	});

	$("#submitemail").click(function(){
		var email = $("#useremail input").val();
		var span;
		var emails = {name:Dname,email:email};
		var parent = $("#useremail input").parents(".form-group");
		parent.find('.msg').remove();
		if(email.lengt == 0){
			span = "<span class='msg text-danger col-sm-3'>请填写邮箱</span>";
			parent.append(span);
		}else{
			$.ajax({
				type:'post',
				url:'/user/postEmail',
				data:emails,
				success:function(data){
					if(data.success == 0){
						span = "<span class='msg text-danger col-sm-3'>请填写正确的邮箱</span>";
						parent.append(span);
					}else{
						$("#usercode").css({
							"display":"block"
						});
						$("#submitemail").css({
							"display":"none"
						});

						$("#usercode").click(function(){
							var code = $("#usercode input").val();
							var parent = $("#usercode input").parents(".form-group");
							parent.find('.msg').remove();
							var span;
							if(code == ""){
								span = "<span class='msg text-danger col-sm-3'>请填写验证码</span>";
								parent.append(span);
							}else{
								if(code == data.code){
									$("#userPWD").css({
										"display":"block"
									});
									$("#usercode").css({
										"display":"none"
									});
								}else{
									span = "<span class='msg text-danger col-sm-3'>验证码错误</span>";
									parent.append(span);
								}
							}
						});


					}
				}
			});
		}
	});


	$("#submitPwd").click(function(){
		// alert("1");
		var password = $("#userPWD input").val();
		// console.log(password);
		var pwd = {name:Dname,pwd:password};
		$("#userPWD").find('.msg').remove();
		if(password.length == 0){
			span = "<span class='msg text-danger'>不能为空</span>";
			$("#userPWD").append(span);
		}else{
			$.ajax({
				type:"POST",
				url:'/user/postPwd',
				data:pwd,
				success:function(data){
					if(data.data == 1){
						alert("成功");
					}
				}
			});
		}
	});


});