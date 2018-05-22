var captcha;
function createCAP(){
	var length = 4;
	captcha = "";
	//所有组成验证码的候选字符
	var arr =new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
            'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
             'V', 'W', 'X', 'Y', 'Z');
	for(var i = 0; i < length; i++){
		var char = Math.floor(Math.random() * 52);
		captcha += arr[char];
	}
	// alert(captcha);
	$("#checkCAP").find('.code').remove();
	$("#checkCAP").append("<strong class='code text-primary'>" + captcha + "</strong>");
}

function verify(){
	var msg;
	var span = "";
	var parent = $("#CAPTCHA").parents(".form-group");
	// console.log(parent);
	parent.find('.msg').remove();
	var code = $('#CAPTCHA').val();
	// console.log(code+"we");
	if(code.length == ""){
		msg = "验证码不能为空";
		span = "<span class='msg error text-danger col-sm-2'>" + msg + "</span>";
		parent.append(span);
		return false;
		// parent.append();
	}else if(code.toUpperCase() != captcha.toUpperCase()){
		msg = "验证码错误";
		span = "<span class='msg error text-danger col-sm-2'>" + msg + "</span>";
		parent.append(span);
		return false;
		// parent.append();
	}else{
		span = "<span class='msg glyphicon glyphicon-ok-sign text-success',aria-hidden='true'></span>";
		parent.append();
		return true;
	}
	// console.log(span);
	// parent.append(span);
}
$(function(){
	createCAP();
	$("form :input#CAPTCHA").blur(function(){
	var isSuccess = verify();
	if(isSuccess == false){
		$("#send").click(function(){
			// console.log("1");
			return false;
		})
	}

});
});
