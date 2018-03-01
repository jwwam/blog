
/**
 * @author xiexingbao
 * 档案加载
 * */
define(["jquery",
        "bootstrap",
        "jqueryui",
        "jqueryMigrate",
        "jqprint"],
        function(jquery,bootstrap,jqueryui,jqueryMigrate,jqprint) {  
	
	//初始化变量
	var buttons= $(" .image-td .btn-group").children('button');//获取按钮数量
	
	 //初始化数据
	 nextPage();
	 backPage();
	 bigBtn();
	 smallBtn();
	 printAll();

	 function showImage(page,func){
		var html = "<img src='data:image/jpeg;base64,"+page+"' alt='无法显示图片' />"
		$("#image-div").html(html); 
		if( func!=null ){
			func();
		}
		$("#loadImg-image").html("");
	 }
	 function imageAjax(showPageNo,func){
		 $("#image-div").html("");
		 $("#loadImg-image").html("")
		 $("#loadImg-image").html("<img alt='加载中...' src='../js/jstree/themes/default/throbber.gif/'>");
		 recordCommon.pageNo = showPageNo;
		 $.ajax({
				type: 'get',
				url: "../recordSearch/getImage?showPageNo="+showPageNo+"&archiveTypeName="+recordCommon.archiveTypeName+"&archiveID="+recordCommon.archiveID,
				dataType: "json",
				data : {},
				success: function (result) {
					if( result.data != null ){
						showImage(result.data,func);
					}else{
						alert("网络异常，无法获取图片！")
					}
				}
			});
	 }
	 //下一页
	function nextPage(){
		var btnClass = $(".btn-group .next-btn");
		btnClass.click(function(){
			    clearSelect();
				btnClass.attr("disabled",true);
				btnClass.html("&nbsp;加载中...");
				var pageNo =  recordCommon.pageNo + 1;
				if(pageNo > recordCommon.maxPageNo ){
					alert("已经是最后一页！")
					btnClass.attr("disabled",false);
					btnClass.html("&nbsp;下一页");
					return;
				}
				imageAjax(pageNo,function(){
					btnClass.attr("disabled",false);
					btnClass.html("&nbsp;下一页");
				});
	        });

	}
	//上一页
	function backPage(){
		var btnClass = $(".btn-group .back-btn");
		btnClass.click(function(){
			clearSelect();
			btnClass.attr("disabled",true);
			btnClass.html("&nbsp;加载中...");
			var pageNo =  recordCommon.pageNo - 1;
			if(pageNo < 1 ){
				alert("这已经是首页！")
				btnClass.attr("disabled",false);
				btnClass.html("&nbsp;上一页");
				return;
			}
			imageAjax(pageNo,function(){
				btnClass.attr("disabled",false);
				btnClass.html("&nbsp;上一页");
			});
		});
	}
	//批量打印
	function printAll(){
		clearSelect();
		$(".btn-group .print-btn").click(function(){
			if( $("[name=chkItem]:checkbox:checked").length == 0 ){
				alert("请选择需要打印的表格！")
				return;
			}
			var array=new Array()
			var i = 0;
			$("[name=chkItem]:checkbox:checked").each(function() {
					array[i]=$(this).attr("id");
		            i++;
			});
			scrollBars(array[array.length-1]);
			$.ajax({
				type: 'get',
				url: "../recordSearch/bulkPrint?page="+array+"&archiveTypeName="+recordCommon.archiveTypeName+"&archiveID="+recordCommon.archiveID,
				dataType: "json",
				data : {},
				success: function (res) {
					for( var i=0;i<res.data.length;i++ ){
						console.log(res.data[i])
						$("#bulkPrint").append('<img style="margin: 0px; padding: 0px; width: 794px; height: 1023px;" src="'+res.data[i]+'" />');
					}

					$("#scroll-bars-dialog").dialog( "close" );
					$("#bulkPrint").jqprint();
				}
			});
		});
	}
	
	//打印时候的滚动条
	function scrollBars(array){
		var second = array.split("-")[1].replace(/^\s+|\s+$/g, '');
		 $("#scroll-bars-dialog").dialog({
			  title: "正在打印",
			  resizable : false,
		      minWidth:"550",
		      minHeight:"250",
		      hide:"slide",//关闭窗口的效果  
		      show:"toggle",//打开窗口的效果  
		      draggable:false, //拖拽默认是true  
		      modal:true//遮罩效果默认是false不遮住  
		 });
		 $("#progressbar").progressbar({value:1});
		 var sum = 0;
		 var count = 200/second;
		 sum = count; 
		 time = setInterval(function(){
			 if( sum>100 ){
				 clearInterval(time);
			 }
			 console.log(sum);
			 $("#progressbar").progressbar({value:sum});
			 sum = sum+count;
        },2000);
		 
	}
	
	function bigBtn(){
		$(".btn-group .big-btn").click(function(){
			clearSelect();
			imageSuofang(true);
		});
	}
	function smallBtn(){
		$(".btn-group .small-btn").click(function(){
			clearSelect();
			imageSuofang(false);
		});
	}
	function clearSelect(){
	
		for(var i=0; i<buttons.length;  i++ ){
			$(buttons[i]).removeClass("active");
		}
	}
	 //兼容IE和火狐   缩小放大、缩放 
    function imageSuofang(args) { 
        var oImg = $("#image-div img"); 
        var oImgoImg; 
        if (args) { 
        	oImg.width(oImg.width()* 1.1); 
        	oImg.height(oImg.height()* 1.1); 
        }else { 
        	oImg.width(oImg.width()/ 1.1); 
        	oImg.height(oImg.height()/1.1); 
        } 
    }     
	
	return{
		 /**
		  * */
		 getImage : function(showPageNo){
			 imageAjax(showPageNo,null);
		 }
	}
});  
