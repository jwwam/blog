
$(function () {
	
	function upload(){
		$("#submit-upload").on("click",function(){
			 var file =$('#file').val();
			 var file2 =$('#file2').val();
			 var file3 =$('#file3').val();
			 if( file == "" ){
				 alert("授权委托书不能为空！");  
			     return false;
			 }
			 if( file2 == "" ){
				 alert("被委托人身份证扫描件不能为空！");  
			     return false;
			 }
			 if( file3 == "" ){
				 alert("被委托人手持身份证照片不能为空！");  
			     return false;
			 }
		});
	}
	//初始化方法
	upload();
	
	$(".templet1").bind("click",function(){
		mouseTemplet("templet1");
	});
	function mouseTemplet(id){
		var options = { to: { width: 280, height: 185 } };
		$("#effect").show( "blind", options, 500, callback );// 运行特效
		$("#effect").hide();
	}
	
	
});

