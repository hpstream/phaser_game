(function($) {

	$.extend({
		highlight: highlight
	});

	function highlight(_dom, highTip, className) {
		return new createHeghLight(_dom, highTip, className);
	}

	/**
	 * 
	 * @param  str _domID      一个标签的id,(需要控制文本的id) 
	 * @param  str highTip    一个jqury选择器字符串,(弹框功能id)
	 * @return  Object     createHeghLight 对象 
	 */
	function createHeghLight(_domID, highTip, className) {
		var that = this;
		this.txt = ""; //被选中的文本
		this._domID = _domID.substr(1);
		this.highTip = highTip;
		this._highTip = $(highTip);
		this.range;
		this.className = className.substr(1);
		$(_domID).css("position", "relative")
		this.init();
	}
	//初始化绑定事件		
	createHeghLight.prototype.init = function() {
		var that = this;
		$(document).on("mouseup", function(event) {
			that.txt = "" //清空被选中的文本
			if(event.button == 2)
				return false;
			var x = event.target;
			if(x.tagName == "HTML")
				return false;
			var flag = false;
			while(x.tagName != "BODY") {
				if(x.id == that._domID) {
					flag = true;
					break;
				}
				x = x.parentNode;
			}
			if(!flag) {
				$(that.highTip).hide();
				//that.hideLight();
				return false;
			}

			if(document.selection) { // IE
				that.txt = document.selection.createRange().htmlText;
			} else if(window.getSelection().rangeCount == 0) { //解决点击法规和数据可视化中的a标签出现的错误
				return false;
			} else {
				that.range = window.getSelection().getRangeAt(0);
				var container = document.createElement('div');
				container.appendChild(that.range.cloneContents());
				that.txt = container.innerHTML;
			}

			if(that.txt && that.range.collapse) {
				that.getPointPosition(event);
				//that.showLight(that.txt); //显示高亮
				//that.addComment(event);
			} 
		})

	}
	createHeghLight.prototype.pointerX = function(event) {
		return event.pageX ||
			(event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
	}
	createHeghLight.prototype.pointerY = function(event) {
		return event.pageY ||
			(event.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
	}
	//获取坐标
	createHeghLight.prototype.getPointPosition = function(event) {
		event = event || window.event;
		var x_Px_page = event.offsetX;
		var y_Px_page = event.offsetY;
		$("#hglighttip").css({
			top: (y_Px_page + 20),
			left: x_Px_page
		});
		$(this.highTip).show();
	}
	//文字显示高亮
	createHeghLight.prototype.showLight = function(txtArr) {
		var arr = [];
		if(typeof txtArr == "string") {
			arr.push(txtArr);
		} else {
			arr = txtArr;
		}
		var _txt = $("#" + this._domID).html();

		for(var i = 0; i < arr.length; i++) {
			var str = "<span class = '" + this.className + "'>" + arr[i] + "</span>";
			var reg = RegExp(arr[i], "g");
			_txt = _txt.replace(reg, str);
		}
		$("#" + this._domID).html(_txt);
		return arr;	
	}
	//文字不显示高亮
	createHeghLight.prototype.hideLight = function() {
		var _txt = $("#" + this._domID).html();
		var str = RegExp('<span class="' + this.className + '">', "g");
		_txt = _txt.replace(str, "");
		_txt = _txt.replace(/\<\/span\>/g, "");
		$("#" + this._domID).html(_txt);
	}
	//添加标注
	
	createHeghLight.prototype.addComment = function(event) {

		var id = new Date().getTime();
		var ins = document.createElement('ins');
		ins.className = this.className;
		ins.id = id;
		this.range.surroundContents(ins);//把获取文本放到标签当中
		var allEpx = '(<ins class="'+this.className+'" id="'+id+'">'+this.txt+'</ins>)|'+"("+this.txt+")";
		var chooseEpx ='<ins class="'+this.className+'" id="'+id+'">'+this.txt+'</ins>';
		
		var _txt = $("#" + this._domID).html();
		var exp1  = new RegExp(allEpx,"g");
		var exp2  = new RegExp(chooseEpx,"g");
		var size = 0;
		var postion = 0;
		var s =_txt.replace(exp1,function(v){
			if(v !=""){
				size++;
				console.log(v);
				if(exp2.test(v)){
					postion = size;
					return ;
				}
			}
		})
			
		var commentIcon = $("<span class='fa fa-commenting jufa-size' icon-id="+id+" style='position:relative;top: -6px;'></span>");
	  
		$("#" + id).after(commentIcon);
		
		return {
			txt:this.txt,
			index:postion,
			id:id
		};
	}

	createHeghLight.prototype.delectComment = function(deleteID) {
		//拿到对应的dom，拿到里面的文本，
		//在其后面插入文本
		//删除当前结点
		var deleteIns = $("#" + deleteID);
		var keyword = deleteIns.html();
		deleteIns.after(deleteIns.html());
		deleteIns.remove();
	    $("#" + this._domID).find("[icon-id="+deleteID+"]").remove();
		
	}

})(jQuery);