
/**
 * @author xiexingbao
 * 审核授权委托书
 * */
define(["text!../../templates/gongshang/noScanCompany.html",
        "jquery",
        "jqueryui",
        "dataTablesBootstrap",
        "dataTables",
		"viewer",
        "componets/datatable/dataTableParam",
        "componets/dialog/dialog"],
        function(html,jquery,jqueryui,dataTablesBootstrap,dataTables,viewer,dataTableParam,dialog) {
	 //初始化数据
		function init(){
			 bindDataTables();//加载表格
			 bindClick();//绑定点击事件
			 $('#approveProxy-image').viewer();
		}

	 //绑定事件
	 function bindClick(){
		 $(".input-group .btn-search").click(function(){
			 bindDataTables();
		 }); //搜索
		 $(".btn-group label").click(function(){
			 setTimeout(bindDataTables, 100);      //设置1秒后执行bindDataTables函数;
		 });
		
	 }

	 function bindDataTables(){
		 var index = 0;
		 var radioVal = $("input[type='radio']:checked").val();//获取条件值
		 $("#datatable").dataTable({
				"bFilter": false,//不使用自带搜索框
				"bProcessing": true, // 是否显示取数据时的那个等待提示
				"bServerSide": true,//这个用来指明是通过服务端来取数据
				"bPaginate": true,
				"bSort": true,
				 destroy:true,
				"sAjaxSource": "../noScanCompany/getList",
				"fnServerData": dataTableParam.retrieveData ,// 获取数据的处理函数
				"bPaginate": true,
				"sPaginationType": "full_numbers",
				"columns": [
					{ "data": "id" },
					{ "data": "accountId" },
					{ "data": "company" },
					{ "data": "status" },
					{ "data": "reason" },
					{ "data": "createDate" },
					{ "data": "id" },
					
				],
				"createdRow": function (row, data, index) {
					/* 设置表格中的内容居中 */
					$('td', row).attr("class", "text-center");
				},
				"fnServerParams": function (aoData) {
					var company =  $(".input-group .input-title").val(); //你要传递的参数
					aoData.push({
						"name": "company",
						"value": company
					});
					aoData.push({
						"name": "status",
						"value": radioVal
					});
				},
				"aoColumnDefs": [{
					"mRender": function (data, type, row) {
							index++;
							return index;
					},
					sDefaultContent: '',
					aTargets: [0]       //列index
				},{
		            "render": function(data, type, row) {
		                var status = data;
		                if( status == 0 ){
		                	return "未处理";
		                }else {
		                	return "已处理";
		                }
		                
		            },
		            "targets":3
		        },
		        {
		            "render": function(data, type, row) {
		                var da = data;
		                da = new Date(da);
		                var year = da.getFullYear();
		                var month = da.getMonth()+1;
		                var date = da.getDate();
		                var time = [year,month,date].join('-');
		                return time;
		            },
		            "targets":5
		        },{
                    "mRender": function (data, type,row ) {
                    	
                    	  return "<a herf='#' id='"+data+"' style='cursor: pointer;'>详情</a>";
                        
                    },
                    sDefaultContent: '',
                    aTargets: [6]       //列index
                }],
				columnDefs: [
					{ "bSortable": false, "aTargets": [ 0 ] }],
				"language": dataTableParam.lang

			});
		 
		 //绑定编辑事件
		 $('#datatable').on( 'click', 'a', function () {
    		 var str = $(this).attr('id');
    		 //绑定Edit
    		 noScanCompanyEdit(str);
		 });
	 }

	//绑定Edit
	function noScanCompanyEdit(id){
		//引入图片预览js
		//初始化表单值
		$.ajax({
			type: 'GET',
			url: '../noScanCompany/getInfoById?id='+id,
			dataType: "json",
			success: function (result) {
				var rfId = result.data.id;
				var iphone = result.data.iphone;
				var reason = result.data.reason;
				var status = result.data.status;
				$(".id").val(result.data.id);
				$(".accountId").val(result.data.accountId);
				$(".company").val(result.data.company);
			    if( status == 0 ){
			    	status = "未处理";
                }else {
                	status =  "已处理";
                }
				$(".status").val(status);
				$(".iphone").val(iphone);
				$(".reason").val(reason);
				$("#noScanCompany-edit-dialog").dialog({
					  title: "详情",
					  resizable : false,
					  height : "600",
					  width : "700",
				      minWidth:"450",
				      minHeight:"300",
				      modal: true,
				      buttons: {
				        "处理": function() {
				        	$.ajax({
				        		type: 'post',
				        		url: '../noScanCompany/deal',
				        		dataType: "json",
				        		data : {
				        			id : rfId,
				        			iphone: iphone,
				        			reason : reason
				        		},
				        		success: function (result) {
				        			alert(result.msg);
				        			bindDataTables();
				        		}
				        	});
				        		
				        	$( this ).dialog( "close" );
				        },
				        "关闭": function() {
				        	$( this ).dialog( "close" );
				        }
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

function getImageData(imgUrl){
	$.post("../approveProxy/getImgData",{imgUrl:imgUrl},function(result){
		$("#approveProxy-image").html("<li ><img style='width:600px;height:450px;' src='data:image/jpeg;base64,"+result.data+"' data-original='data:image/jpeg;base64,"+result.data+"'    alt='无法显示图片' /> </li>");
	});
}

