
$(function () {
	
	//declaration.html 倒计时
	var countdown = 10;
	function setTimeoutFunc(){
		console.log("=========="+countdown);
		 $(".declaration-button .agree").val("同意("+countdown+"秒倒数)");
		 if( countdown == 0 ){
				clearInterval(flag);
				agree();
		 }
		 countdown--; 
	}
	var flag=setInterval(setTimeoutFunc,1000);
	
	function agree(){
		
		window.location.href= "../recordAuth/agree";
		
	}
	
	 $(".declaration-button .agree").on("click",function(){
		 	clearInterval(flag);
			agree();
	 });
	
	 $(".declaration-button .noAgree").on("click",function(){
		 window.history.go(0); 
	 });
	
	 
});

