
/**
 * @author xiexingbao
 * 数据获取
 * */
define(["text!../../templates/gongzhonghao/enteringScroe.html",
        "jquery",
        "jqueryui",
        "dataTables",
        "componets/datatable/dataTableParam",
        "componets/dialog/dialog"
        ],
        function(html,jquery,jqueryui,dataTables,dataTableParam,dialog) {  
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
		 addDialog();
		//绑定修改事件
	 }
	 
	 //信息发布
	 function addDialog(){
		 $("#add-button").click(function() {
			//加载dialog
			 var obj = {};
			 obj.title = "积分管理";
			 obj.height = "auto";
			 obj.width = "500";
			 obj.submit = dialogFunc;
			 obj.id = "add-dialog";
			 dialog.newDialog(obj);
		 });
		 function dialogFunc(){
				var customerId = $('#add-dialog .customerId').val();
				var otherScore = $('#add-dialog .otherScore').val();
				$.ajax({
					 type: 'post',
					 url: "../searchScore/addScore",
					 dataType: "json",
					 data : {
						 'customerId':customerId+"",
						 'otherScore':otherScore+""
					 },
					 success: function (result) {
						 dialog.newPrompt(result.msg);
						 bindDataTables();//加载表格
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
				"sAjaxSource": "../searchScore/findTable",
				"fnServerData": dataTableParam.retrieveData ,// 获取数据的处理函数
				"bPaginate": true,
				"sPaginationType": "full_numbers",
				"columns": [
					{ "data": "customerId" },
					{ "data": "customerId" },
					{ "data": "otherScore" },
					{ "data": "createDate" },
					{ "data": "customerId" }
					
				],
				"createdRow": function (row, data, index) {
					/* 设置表格中的内容居中 */
					$('td', row).attr("class", "text-center");
				},
				"fnServerParams": function (aoData) {
					var customerId =  $(".input-group .input-title").val(); //你要传递的参数
					aoData.push({
						"name": "customerId",
						"value": customerId
					});
				},
				"aoColumnDefs": [{
					"mRender": function (data, type, row) {
						
							return "<input type='checkbox' name='customerId' value='"+data+"' />";
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
		            "targets":3
		        },{
                    "mRender": function (data, type,row ) {
                    	
                    	return "<a herf='#' id='"+row.otherScore+"' name='"+row.customerId+"' style='cursor: pointer;'>修改</a>";
                        //return "<button type='button'  class='btn btn-default' onclick=\"editDialog(\'"+row.otherScore+"\',\'"+row.customerId+"\')\" >修改</button>";
                    },
                    sDefaultContent: '',
                    aTargets: [4]       //列index
                }],
				columnDefs: [
					{ "bSortable": false, "aTargets": [ 0 ] }],
				"language": dataTableParam.lang

			});
		 
		  //绑定修改事件
		  $('#datatable').on( 'click', 'a', function () {
			  	console.log(this);
			  	var otherScore = $(this).attr('id');
	    		var customerId = $(this).attr('name');
	    		 //绑定Edit
	    		editDialog(otherScore,customerId)
		   });
		 
			 
	 }
	 

	//绑定Edit
	function editDialog(otherScore,customerId){
		//初始化表单值
		$("#edit-dialog .customerId").val(customerId);
		$("#edit-dialog .otherScore").val(otherScore);
		require([ "componets/dialog/dialog"],function(dialog){
			 var obj = {};
			 obj.title = "修改积分";
			 obj.width = "500";
			 obj.height = "300";
			 obj.submit = dialogFunc;
			 obj.id = "edit-dialog";
			 dialog.newDialog(obj);
			 function dialogFunc(){
				 var customerId = $("#edit-dialog .customerId").val();
				 var otherScore = $("#edit-dialog .otherScore").val();
				$.ajax({
					type: 'POST',
					url: '../searchScore/updateScore',
					dataType: "json",
					data : {
						 'customerId':customerId+"",
						 'otherScore':otherScore+""
					},
					success : function(result){
						 dialog.newPrompt(result.msg);
						 bindDataTables();
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


