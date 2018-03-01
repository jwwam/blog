
/**
 * @author xiexingbao
 * 档案加载
 * */
define(["jquery",
        "jqueryui",
        "componets/business/recordImage"],
        function(jquery,jqueryui,recordImage) {  
	 //初始化数据
	 
	 //加载table
	 function appendHTML(data){
		 var html = "<tr><td><input type='checkbox' name='checkboxAll' id='checkboxAll'></td><td width=\"10%\">序号</td><td>标题</td><td width=\"15%\">页码</td></tr>";
		 for(var i=0; i<data.length; i++){
			 var page  = data[i].pageNo.split("-");
			 if( i == data.length-1 ){
				 recordCommon.maxPageNo  = data[i].pageNo.split("-")[1].replace(/^\s+|\s+$/g, '');
			 }
			 var pageNo = page[0].replace(/^\s+|\s+$/g, '');
			 if( pageNo == 1 ){
				 //設置默認选中第一个表格a标签，并设置class
				 html += "<tr><td><input type='checkbox' name='chkItem' id='"+data[i].pageNo+"'></td><td>"+data[i].id+"</td><td><a class='aSelected' id='getImageId-"+pageNo+"' >"+data[i].title+"</a></td><td width=\"15%\">"+data[i].pageNo+"</td></tr>";
			 }else{
				 html += "<tr><td><input type='checkbox' name='chkItem' id='"+data[i].pageNo+"'></td><td>"+data[i].id+"</td><td><a id='getImageId-"+pageNo+"' >"+data[i].title+"</a></td><td width=\"15%\">"+data[i].pageNo+"</td></tr>";
			 }
		 }
		
		 $('#loadImg').html("");
	     $("#table-data").html(html);
	     recordImage.getImage(1);//默认点击第一a标签
	     $("#table-data a").each(function(){
	    	 $(this).click(function(){
	    		 $("#table-data a").each(function(){
	    			 $(this).removeClass("aSelected");
	    		 });
	    		 var strPage = $(this).attr('id').split("-")[1];
	    		 recordImage.getImage(Number(strPage));
	    		 $(this).addClass("aSelected");
	    	 });
	     });
	     $('#checkboxAll').change(function() { 
	    	 if($('#checkboxAll').is(':checked')){
	    		 $("input[name='chkItem']").prop("checked",true);// true设为选中 false设为取消 
	    	 }else{
	    		 $("input[name='chkItem']").prop("checked",false);// true设为选中 false设为取消 
	    	 }
	     }); 
	 }
	 function ajax(archiveID,archiveTypeName){
		 $.ajax({
				type: 'post',
				url: "../recordSearch/getTable",
				dataType: "json",
				data : {
					'archiveID' : archiveID+"",
					'archiveTypeName':archiveTypeName+""
				},
				success: function (result) {
					if(result.data == null){
						$('#table-data').append("<div>暂无数据</div>");
					}else{
						appendHTML(result.data);
					}
				}
			});
	 }
	 function testAjax(){
		    //var data = [{"id":"1","pageNo":"1 - 1","title":"核准通知书（包括备案登记通知书）"},{"id":"2","pageNo":"2 - 19","title":"名称预先核准通知书"},{"id":"3","pageNo":"20 - 21","title":"登记审核表"},{"id":"4","pageNo":"22 - 24","title":"设立登记申请书（包括材料真实性承诺书、委托书）"},{"id":"5","pageNo":"25 - 36","title":"股东会或董事会决议"},{"id":"6","pageNo":"37 - 61","title":"章程"},{"id":"7","pageNo":"62 - 77","title":"资金证明（包括审计报告、验资证明、财政部门出具的国有资产权登记表、外国（地区）投资者资信证明等）"},{"id":"8","pageNo":"78 - 80","title":"股东或成员单位资料（包括股东名单、股东的主体资格证明、自然人身份证复印件等）"},{"id":"9","pageNo":"81 - 88","title":"法定代表人、公司秘书、董事、监事、高级管理人员情况资料"},{"id":"10","pageNo":"89 - 90","title":"场地使用证明（包括场地调查表、产权证明以及其他证明文件、场地租赁合同或协议等）"},{"id":"11","pageNo":"91 - 91","title":"商事主体信息公示和提交年度报告告知书存根"},{"id":"12","pageNo":"92 - 94","title":"其它有关材料（包括受理通知书存根等）"}];
		    var data = [{"id":"1","pageNo":"1 - 1","title":"核准通知书（包括备案登记通知书）"},{"id":"2","pageNo":"2 - 19","title":"名称预先核准通知书"},{"id":"3","pageNo":"20 - 21","title":"登记审核表"},{"id":"4","pageNo":"22 - 24","title":"设立登记申请书（包括材料真实性承诺书、委托书）"}];
			appendHTML(data);
	 }
	return{
		 /**
		  *      archiveID = "00004413000000000000064001";
		  *  	 archiveTypeName = "开业";
		  * */
		 getTable : function(archiveID,archiveTypeName){
			 ajax(archiveID,archiveTypeName);
			 //testAjax();
		 }
	}
});  
