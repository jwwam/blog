
/**
 * @author xiexingbao
 * 数据获取
 * */
define(["text!../../templates/keji/gain.html",
        "jquery",
        "jqueryui",
        "ueditorConfig",
        "ueditorAll",
        "dataTablesBootstrap",
        "dataTables",
        "componets/datatable/dataTableParam",
        "datetimepicker",
        "componets/dialog/dialog",
        "componets/base/base", 
        "componets/tree/lazyTree"],
        function(html,jquery,jqueryui,ueditorConfig,ueditorAll,dataTablesBootstrap,dataTables,dataTableParam,datetimepicker,dialog,base,lazyTree) {  
	 //初始化数据
	 function init(){
		 bindDataTables();//加载表格
		 bindClick();//绑定点击事件
	 }
	 //绑定事件
	 function bindClick(){
		 $(".input-group .btn-search").click(function(){
			 bindDataTables();
		 }); //搜索
		 dateDeal();//绑定gain-button
		 gainDelete();//绑定delete-button
		 gainPublish();//绑定publish-button
	 }
	 //获取时间处理按钮绑定
	 function  dateDeal(){
		$('.form_date').datetimepicker({
			    language:  'zh-CN',
			    weekStart: 1,
			    todayBtn:  1,
				autoclose: 1,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				forceParse: 0
		});
		//获取时间
		$("#gain-button").click(function() {
			 var obj = {};
			 obj.title = "选择获取时间";
			 obj.height = "300";
			 obj.width = "650";
			 obj.submit = dialogFunc;
			 obj.id = "gain-button-dialog";
			 dialog.newValidateDialog(obj);
			 function dialogFunc(){
				 var startDate = $("#startDate").val();
				 var endDate = $("#endDate").val();
				 if( startDate == "" || endDate == ""  ){
					 dialog.newPrompt("请选择开始和结束时间！");
					 return ;
				 }
				var data = {"startDate":startDate,"endDate":endDate};
				$.ajax({
					type: 'post',
					url: "../gain/getContentInfo",
					dataType: "json",
					data : data,
					success: function (result) {
						dialog.newCountDown(result.msg,function(){
							 bindDataTables();//加载表格
						});
						if( result.status == 1 ){
							$("#"+obj.id).dialog( "close" );
						}
					}
				});
			}
			
		});
		
	 }
	 //信息发布
	 function gainPublish(){
		 $("#publish-button").click(function() {
			
			//加载tree
			$("#publish-button-dialog").append(lazyTree.getHTML());
			lazyTree.init("../gain/getSectionTree");
			//加载dialog
			 var obj = {};
			 obj.title = "栏目目录";
			 obj.height = "auto";
			 obj.width = "500";
			 obj.submit = dialogFunc;
			 obj.id = "publish-button-dialog";
			 dialog.newDialog(obj);
		 });
		 function dialogFunc(){
			    var ids="";//发布的行id
				var ckbs = $("input[name=id]:checked");
				if (ckbs.size() == 0) {
					alert("未选中要发布的行！");
					return;
				}
				ckbs.each(function(){
					ids+=$(this).val()+",";
				});
				ids=ids.substring(0,ids.length-1);
				
				var instance = $('#authorityBody').jstree(true);
				var receive = instance.get_bottom_checked();
				$.ajax({
					 type: 'post',
					 url: "../gain/publishContent",
					 dataType: "json",
					 data : {
						 'sendId':ids+"",
						 'receive':receive+""
					 },
					 success: function (result) {
						 dialog.newPrompt(result.msg);
						 bindDataTables();//加载表格
						 lazyTree.destroy();
					 }
			    });
		 }
	 }
	 
	 function bindDataTables(){
		
		 $("#datatable").dataTable({
				"bFilter": false,//不使用自带搜索框
				"bProcessing": true, // 是否显示取数据时的那个等待提示
				"bServerSide": true,//这个用来指明是通过服务端来取数据
				"bPaginate": true,
				"bSort": true,
				 destroy:true,
				"sAjaxSource": "../gain/getGain",
				"fnServerData": dataTableParam.retrieveData ,// 获取数据的处理函数
				"bPaginate": true,
				"sPaginationType": "full_numbers",
				"columns": [
					{ "data": "id" },
					{ "data": "title" },
					{ "data": "createDate" },
					{ "data": "id" },
					
				],
				"createdRow": function (row, data, index) {
					/* 设置表格中的内容居中 */
					$('td', row).attr("class", "text-center");
				},
				"fnServerParams": function (aoData) {
					var title =  $(".input-group .input-title").val(); //你要传递的参数
					aoData.push({
						"name": "title",
						"value": title
					});
				},
				"aoColumnDefs": [{
					"mRender": function (data, type, row) {
						
							return "<input type='checkbox' name='id' value='"+data+"' />";
					},
					sDefaultContent: '',
					aTargets: [0]       //列index
				},{
		            "render": function(data, type, row) {
		                var da = data;
		                da = new Date(da);
		                var year = da.getFullYear();
		                var month = da.getMonth()+1;
		                var date = da.getDate();
		                var time = [year,month,date].join('-');
		                return time;
		            },
		            "targets":2
		        },{
                    "mRender": function (data, type,row ) {
                    	//\"jrzt(\'"+lmid+"\')\"
                    	return "<a herf='#' id='"+data+"'  style='cursor: pointer;'>修改</a>";
                        //return "<button type='button'  class='btn btn-default' onclick=\"gainEdit(\'"+data+"\')\" >修改</button>";
                        
                    },
                    sDefaultContent: '',
                    aTargets: [3]       //列index
                }],
				columnDefs: [
					{ "bSortable": false, "aTargets": [ 0 ] }],
				"language": dataTableParam.lang

			});
		 
			 //绑定编辑事件
			 $('#datatable').on( 'click', 'a', function () {
				 console.log(this);
				 var id = $(this).attr('id');
	    		 //绑定Edit
	    		 gainEdit(id);
			 });
	 }

	 function gainDelete(){
		 $("#delete-button").click(function(){
			 
				var ids="";
				var ckbs = $("input[name=id]:checked");
				if (ckbs.size() == 0) {
					alert("未选中要删除的行！");
					return;
				}
				ckbs.each(function(){
					ids+=$(this).val()+",";
				});
				ids=ids.substring(0,ids.length-1);
				$.ajax({
					type: 'GET',
					url: '../gain/delete?ids='+ids,
					dataType: "json",
					success: function (result) {
						if(result.status==1){
							dialog.newPrompt("<div style='margin-left:100px;'>"+result.msg+"</div>");
							bindDataTables();//加载表格
						}else{
							dialog.newPrompt("<div style='margin-left:100px;'>"+result.msg+"</div>");
						}
					}
				});
			});
	 }
	 

	//绑定Edit
	function gainEdit(id){
			var ue = UE.getEditor('container');
			//初始化表单值
			$.ajax({
				type: 'GET',
				url: '../gain/getById?id='+id,
				dataType: "json",
				success: function (data) {
					//对编辑器的操作最好在编辑器ready之后再做
					ue.ready(function() {
					    //设置编辑器的内容
						ue.setContent(data.content);
					});
					$(".myTitle").val(data.title);
					$(".fKeyWord").val(data.fKeyWord);
					$(".fChannelName").val(data.fChannelName);
					$(".fWebSite_name").val(data.fWebSite_name);
					
					require([ "componets/dialog/dialog"],function(dialog){
						 var obj = {};
						 obj.title = "修改内容";
						 obj.height = "700";
						 obj.width = "900";
						 obj.submit = dialogFunc;
						 obj.id = "gain-edit-dialog";
						 dialog.newDialog(obj);
						 function dialogFunc(){
							ue.ready(function() {
								//获取编辑器的内容
								data.content = ue.getContent();
							});
							data.title = $(".myTitle").val();
							data.fKeyWord = $(".fKeyWord").val();
							data.fChannelName = $(".fChannelName").val();
							data.fWebSite_name = $(".fWebSite_name").val();
							 
							$.ajax({
								type: 'POST',
								url: '../gain/update',
								dataType: "json",
								data : {
									'content' : JSON.stringify(data)
								},
								success : function(result){
									 dialog.newPrompt(result.msg);
									 bindDataTables();
									 
								}
							});
						 }
					});
				}
			});
			
	}
	 
	 return{
		'changeHtml':function(){
			return html;
		},
	 	'init':function(){
			init();
		}
	 }
 
});  
