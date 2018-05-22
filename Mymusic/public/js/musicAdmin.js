$(function(){
	//为表单必填文本框添加信息，选择form中的所有后代input进行遍历，当input元素中含有required类时，向input元素的.form-group增加
	//创建的元素
	$("form :input.required").each(function(){
		var $required = $("<strong class='text-danger col-sm-1'>*</strong>");
		$(this).parents(".form-group").append($required);
	});
	//为表单添加失去焦点事件
	$("form :input").blur(function(){
		//获取父辈元素
		var parent = $(this).parents(".form-group");
		//如果发现有同类名元素出现，删除该元素
		parent.find('.msg').remove();
		if($(this).is("#inputTitle")){
			if($.trim(this.value) == ""){
				var msg = "歌曲名不能为空";
				parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
			}else{
				parent.append("<span class='msg glyphicon glyphicon-ok-sign text-success',aria-hidden='true'></span>");
			}
		}
		if($(this).is("#inputSinger")){
			if($.trim(this.value) == ""){
				var msg = "歌手不能为空";
				parent.append("<span class='msg error text-danger col-sm-2'>" + msg + "</span>");
			}else{
				parent.append("<span class='msg glyphicon glyphicon-ok-sign text-success',aria-hidden='true'></span>");
			}
		}

	}).keyup(function(){
		//triggerHandler防止事件执行完后，浏览器自动为标签获得检点
		$(this).triggerHandler("blur");
	}).focus(function(){
		$(this).triggerHandler("blur");
	});


	//点击提交按钮后，触发文本框的失去焦点事件
	$("#submit").click(function(){
		//trigger规定被选元素要触发的事件
		$("form .required:input").trigger("blur")
			var number = $("form .error").length;
			if(number){
				return false;
			}
	});

	$("#inputUp").click();
	$("#inputUp").on("change", function (){
		// alert("1")
		var obj = document.getElementById("inputUp");
		console.log(obj.files[0].name);
		var str = "<span class='text-danger'>"+obj.files[0].name+"</span>";
		$("#poster").append(str);
		$("#inputPoster").val(obj.files[0].name);
	});
	$("#inputUpSong").click();
	$("#inputUpSong").on("change", function (){
		// alert("1")
		var obj = document.getElementById("inputUpSong");
		console.log(obj.files[0].name);
		var str = "<span class='text-danger'>"+obj.files[0].name+"</span>";
		$("#song").append(str);
		$("#inputSong").val(obj.files[0].name);
	});

	$("#navbar li:first-child").removeClass("active");
	$("#navbar li:nth-child(4)").addClass("active");

	
});
