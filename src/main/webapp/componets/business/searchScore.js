
initDate();//初始化积分数据


function initDate(){
	$.ajax({
		type: 'get',
		url: "../searchScore/scoring",
		dataType: "json",
		data : {},
		success: function (result) {
			$("#scoreShow").html("");
			$("#scoreShow").html(result.data);
		}
	});
}