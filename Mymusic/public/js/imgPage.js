$(function(){
	var file;
	$("#input").click();
	$("#input").on('change',function(check){
		var obj = document.getElementById("input");
		console.log(obj.files[0]);
		if(obj.files[0].type == "image/jpeg"){
			file = obj.files[0];
			var reader = new FileReader();
			reader.readAsDataURL(obj.files[0]);
			reader.onload = function(){
			document.getElementById('show').src = this.result;
			}
		}
	});

	$("#submit").click(function(check){
		if(file){
			// alert("1");
		}else{
			$("#input").focus();
			check.preventDefault();
		}
	})
});