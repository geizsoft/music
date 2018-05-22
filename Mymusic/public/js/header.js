// var ischange;
$("#userSend").click(function(){
	// ischange = true;
	$("form :input").trigger("blur");
	var number = $('form .error').length;
	if(number){
		return false;
	}else{
		return true;
	}
});
$("#reset").click(function(){
	$("form :input").val(""); 
});

$(function(){
	$("#navbar li").click(function(){
		$("#navbar li").removeClass("active");
		$(this).addClass('active');
	});
	// $("#search button").click(function(){
	// 	alert("1");
	// })

	$("#signInModal #reset").click(function(){
		$("#loginName").val("");
	});
	$("#userSend").click(function(){
		// $("#loginName").val("");
		// $("#loginPaddword").val("");
		// console.log(captha);
		var cap = $("#CAPTCHA").val();
		if(cap == ""){
			return false;
			 // $("#CAPTCHA").val("11");
			
		}
	})

});

