
/**
 * @author xiexingbao
 * 档案加载
 * */
define(["text!../tree/lazyTree.html",
        "jquery",
        "jqueryui",
        "jstree",
        "componets/business/recordTable"],
        function(html,jquery,jqueryui,jstree,recordTable) {  
	 //初始化数据
	
	 (function init(){
		 getTree();//加载tree
		
	 })();
	 
	 //加载tree
	 function getTree(){
		 $("#tree").append(html);
		 initEvent();
		 //testInitEvent();
		 $('#loadImg').remove();
	 }
	
	 //初始化树数据
	 function initEvent (){
			$.ajax({
				type: 'get',
				url: "../recordSearch/getTree",
				dataType: "json",
				data : {},
				success: function (result) {
					if(result.data == null){
						$('#authorityBody').append("<div>暂无数据</div>");
					}else{
						$('#authorityBody').jstree({ 'core' : {
							'data' : result.data
		                 }});
						  // 展开节点
			            $("#authorityBody").on("loaded.jstree", function (event, data) {
			                // 展开所有节点
			            	$('#authorityBody').jstree('open_all');
			            });
			            bindClick();
					}
				}
			});
		 
		}
	 	//测试树数据
		function testInitEvent (){
			$('#authorityBody').jstree({ 'core' : {
				'data' : [{"id":"1","parent":"#","text":"企业","title":"","type":"","username":""},{"id":"2","parent":"1","text":"开业","title":"","type":"","username":""},{"id":"3","parent":"2","text":"开业 [2013-12-20]","title":"开业","type":"","username":"00004413000000000000064001"},{"id":"4","parent":"1","text":"变更","title":"","type":"","username":""},{"id":"5","parent":"4","text":"变更 [2016-01-25]  注册号 备案","title":"变更","type":"","username":"00004413000000000000001002"},{"id":"6","parent":"1","text":"备案","title":"","type":"","username":""},{"id":"7","parent":"6","text":"备案 [2017-05-23]","title":"备案","type":"","username":"00004413000000000001024005"},{"id":"8","parent":"6","text":"备案 [2015-11-10]","title":"备案","type":"","username":"00004413000000000001024004"},{"id":"9","parent":"6","text":"备案 [2015-06-03]","title":"备案","type":"","username":"00004413000000000001024003"},{"id":"10","parent":"6","text":"备案 [2014-07-18]","title":"备案","type":"","username":"00004413000000000001024002"},{"id":"11","parent":"6","text":"备案 [2014-01-02]","title":"备案","type":"","username":"00004413000000000001024001"}]
	         }});
			  // 展开节点
	        $("#authorityBody").on("loaded.jstree", function (event, data) {
	            // 展开所有节点
	        	$('#authorityBody').jstree('open_all');
	        });
	        bindClick();
		 
		}
		//绑定树点击事件
		function bindClick(){
			$("#authorityBody").bind('activate_node.jstree', function(obj, e) {               
				var data = e.node.original;
				console.log(data);
				if( data.username == "" ){
					$("#loadImg").html("<div>请选择末节点！</div>");
					$("#table-data").html("");
				}else{
					// archiveID = "00004413000000000000064001";
					// archiveTypeName = "开业";
					$("#loadImg").html("")
					$("#table-data").html("");
					$("#loadImg").html("<img alt='加载中...' src='../js/jstree/themes/default/throbber.gif/'>");
					recordCommon.archiveID = data.username;
					recordCommon.archiveTypeName = data.title;
					recordTable.getTable(data.username,data.title);
				}
		    });
		}
	
});  

