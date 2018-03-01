
$(function () {
	
	//加载日期组件
	$( ".datepicker" ).datepicker({
		dateFormat:'yy-mm-dd',
		 dayNamesMin: ['日','一','二','三','四','五','六'],
		 monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		 minDate: new Date()
	});
	$( ".datepicker2" ).datepicker({
		dateFormat:'yy-mm-dd',
		 dayNamesMin: ['日','一','二','三','四','五','六'],
		 monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		 minDate: new Date()
	});
	/**
	 * 保存模板信息
	 * **/
	function saveRecordFile(){
		var TYSHXYDM = $("input[name='TYSHXYDM']").val();
		var GSMC = $("input[name='GSMC']").val();
		var FDDBRXM = $("input[name='FDDBRXM']").val();
		var FDDBRSFZHM = $("input[name='FDDBRSFZHM']").val();
		var BWTRXM = $("input[name='BWTRXM']").val();
		var BWTRSFZHM = $("input[name='BWTRSFZHM']").val();
		var iphone = $("input[name='BWTRSJHM']").val();
		var startTime = $("input[name='startTime']").val();
		var endTime = $("input[name='endTime']").val();
		var id = $("input[name='id']").val();
		
		$(".TYSHXYDM").html("");
		$(".GSMC").html("");
		$(".FDDBRXM").html("");
		$(".FDDBRSFZHM").html("");
		$(".BWTRXM").html("");
		$(".BWTRSFZHM").html("");
		$(".BWTRSJHM").html("");
		
		if( TYSHXYDM == "" ){
			$(".TYSHXYDM").html("统一社会信用代码或注册号不能为空！");
			return false;
		}
		if( GSMC == "" ){
			$(".GSMC").html("委托人（商事主体名称）不能为空！");
			return false;
		}
		if( FDDBRXM == "" ){
			$(".FDDBRXM").html("法定代表人姓名不能为空！");
			return false;
		}
		// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
		if(reg.test(FDDBRSFZHM) === false)  
		{  
			$(".FDDBRSFZHM").html("法定代表人身份证号码不正确！");
			return  false;  
		}  
		if( BWTRXM == "" ){
			$(".BWTRXM").html("被委托人姓名不能为空！");
			return false;
		}
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
		if(reg.test(BWTRSFZHM) === false)  
		{  
			$(".BWTRSFZHM").html("被委托人身份证号码不正确！");
			return  false;  
		} 
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
		if(!myreg.test(iphone)) 
		{ 
			$(".BWTRSJHM").html("被委托人手机号码不正确！");
		    return false; 
		} 
		
		if( startTime == "" || endTime == "" ){
			$(".time").html("委托时间不能为空！");
			return false;
		}
		
		$.ajax({
			type: 'post',
			url: "../recordAuth/saveRecordFile",
			dataType: "json",
			data : {
				id : id,//uuid
				TYSHXYDM : TYSHXYDM,//统一社会信用代码或注册号
				GSMC  :  GSMC,//公司名称
				FDDBRXM  :  FDDBRXM,//法定代表人姓名
				FDDBRSFZHM  :  FDDBRSFZHM,//法定代表人身份证号码
				BWTRXM :  BWTRXM,//被委托人姓名
				BWTRSFZHM  :  BWTRSFZHM,//被委托人身份证号码
				iphone  :  iphone,//被委托人手机号码
				startTime  :  startTime,//委托开始时间
				endTime  :  endTime//委托截止时间
			},
			success: function (result) {
				if(result.status=="21"){
					alert("aaa");
					$(".FDDBRXM").html(result.msg);
					return false;
				}
				if(result.status=="22"){
					$(".FDDBRSFZHM").html(result.msg);
					return false;
				}
				var msg = "<div style='text-align: center;margin-top:20px;'>"+result.msg+"</div>";
				var resultId = result.data;
				newPrompt(msg);
				if( result.status == "1" ){
					downloadTemp(resultId);
				}
				
			}
		});
	}
	function newPrompt(msg){
		 $("#dialog").append(msg);
		 $("#dialog").dialog({
			  title: "提示框",
		      height: "auto",
		      minWidth:"200",
		      minHeight:"130"
		});
		 setTimeout(function(){
			 $("#dialog").dialog( "close" );
			 $("#dialog").html("");
         }, 2000);
	 }
	//跳转下载模板页面
	function downloadTemp(id){
		window.location.href= "../recordAuth/downloadTemp?id="+id;
	}
	$("#submit-temp").on("click",function(){
		saveRecordFile();
	});
	

	
	
	
	
});

