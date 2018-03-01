
$(function () {
	//初始化方法
	
	function submitSMS(){
		$("#submit-SMS").on("click",function(){
			 var phone =$('#phone').val();
			 if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){ 
		        alert("无效手机号码！");  
		        return false; 
			 } 
			 var code =$('#code').val();
			 if( code == "" || code.length!=6){
				 alert("请输入6位数短信验证码！");  
			     return false;
			 }
		});
	}
	submitSMS();
	
});