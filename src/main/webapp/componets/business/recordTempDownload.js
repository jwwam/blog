
$(function () {
	
	function init(){
		var id = $("input[name='id']").val();
		$.ajax({
			type: 'get',
			url: "../recordAuth/getRecordFile?id="+id,
			dataType: "json",
			data : {},
			success: function (result) {
				var data = result.data;
				$(".tyshxydm").html(data.tyshxydm);
				$(".gsmc").html(data.gsmc);
				$(".fddbrxm").html(data.fddbrxm);
				$(".fddbrsfzhm").html(data.fddbrsfzhm);
				$(".bwtrxm").html(data.bwtrxm);
				$(".bwtrsfzhm").html(data.bwtrsfzhm);
				$(".bwtrsjhm").html(data.iphone);
				
				var startTime = data.startTime.split("-");
				$(".year-s").html(startTime[0]);
				$(".month-s").html(startTime[1]);
				$(".day-s").html(startTime[2]);
				
				var endTime = data.endTime.split("-");
				$(".year-e").html(endTime[0]);
				$(".month-e").html(endTime[1]);
				$(".day-e").html(endTime[2]);
				
			}
		});
	}
	init();
	
	/**********recordTempDownload.html***********/
	/***
	 * 在线打印模板
	 * */
	$("#print-temp").on("click",function(){
		
		$("#content").jqprint();
		
	});
	
	/***
	 * 下载模板
	 * */
	$("#download-temp").on("click",function(){
		var id = $("input[name='id']").val();
		window.location.href= "../recordAuth/download?id="+id;
	});
	
	/***
	 * 点击进行一个步骤
	 * */
	$("#next-temp").on("click",function(){
		var id = $("input[name='id']").val();
		var phone = $(".bwtrsjhm").html();
		window.location.href= "../recordAuth/nextRecord?id="+id+"&phone="+phone;
	});
	
	
	
	
	
	
});

